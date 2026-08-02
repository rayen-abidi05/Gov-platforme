const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();
const {addFiles} = require ("../controllers/files")
const {logActivity} = require ("../lib/logActivity")

const getRequestRegis = async(req,res) => {
    try{
        
        const user = req.user;
        const requests = await prisma.registrationRequest.findMany({
            where : {
                company : {
                    userId : user.id
                }
            },
            orderBy: {
            createdAt: "desc",
            },
            include : {
                company : true,
                documents : true
            }
        })
         res.status(200).json ({requests})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}

const getRequestRegisById = async(req,res) => {
    try{
        
        const user = req.user;
        const {id} = req.params
        const request = await prisma.registrationRequest.findFirst({
            where : {
                id : id,
                company : {
                    userId : user.id
                },
                
            },
            
        })
        if (!request) {
            return res.status(404).json({
                message: "Request not found",
            });
            }
                
        res.status(200).json ({request})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}

// ---------- ADMIN — read, now logged ----------
const getRequestRegisByIdAdmin = async(req,res) => {
    try{
        
        const user = req.user;
        const {id} = req.params
        const request = await prisma.registrationRequest.findFirst({
            where : {
                id : id,

                
            },
            
        })
        if (!request) {
            return res.status(404).json({
                message: "Request not found",
            });
            }

        await logActivity({
            userId: user.id,
            action: "VIEW_REQUEST",
            entity: "RegistrationRequest",
            entityId: request.id,
        });

        res.status(200).json ({request})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}

const getAllRequestRegis = async(req,res) => {
    try{
        const user = req.user;

        const requests = await prisma.registrationRequest.findMany({
            include: {
                company: {
                    select: {
                        commName: true,
                        matFisc: true,
                        governorate: true,
                        isRented: true,
                        isResident: true,  
                        exportType: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                documents: true,
                ministerFormulaire: {
                    select: {
                        status: true,
                    },
                },
                storageInspection: {
                    select: {
                        status: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        await logActivity({
            userId: user.id,
            action: "VIEW_ALL_REQUESTS",
            entity: "RegistrationRequest",
            entityId: "ALL",
        });

         res.status(200).json ({requests})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}

const addRequest = async (req, res) => {
    try {
        console.log("Controller reached");
        const user = req.user;
        const { note = "", requestText } = req.body;

        const company = await prisma.company.findUnique({
            where: { userId: user.id }
        });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const files = req.files || {};

        if (company.isRented && !files.RENTEDDECLARATION) {
            return res.status(400).json({ message: "RENTEDDECLARATION is required" });
        }

        if (!company.isRented && !files.CERTIFICATIONOWNERSHIP) {
            return res.status(400).json({ message: "CERTIFICATIONOWNERSHIP is required" });
        }

        if (!company.isResident) {
            if (!files.DIWAN) {
                return res.status(400).json({ message: "DIWAN is required" });
            }
            if (!files.MARKETCONTROLDECLARATION) {
                return res.status(400).json({ message: "MARKETCONTROLDECLARATION is required" });
            }
            if (!requestText || !requestText.trim()) {
                return res.status(400).json({ message: "requestText is required for non-resident companies" });
            }
        }

        const request = await prisma.registrationRequest.create({
            data: {
                status: "PENDING",
                notes: note,
                companyId: company.id
            }
        });

        await addFiles(files, request.id);

        
        if (!company.isResident) {
            await prisma.ministerFormulaire.create({
                data: {
                    requestText,
                    registrationRequestId: request.id,
                },
            });
        }

        const admins = await prisma.user.findMany({
            where: { role: "ADMIN" },
            select: { id: true },
        });

        await prisma.notification.createMany({
            data: admins.map((admin) => ({
                userId: admin.id,
                title: "Nouvelle demande d'inscription",
                message: `${company.commName} a soumis une nouvelle demande d'inscription.`,
                isRead: false,
            })),
        });

        return res.status(201).json({ message: "Request created successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const user = req.user;

  const request = await prisma.registrationRequest.update({
    where: { id },
    data: { status, notes, reviewedAt: new Date() },
    include: { company: true, ministerFormulaire: true },
  });

  
  if (
    status === "APPROVED" &&
    !request.company.isResident &&
    request.ministerFormulaire?.status !== "APPROVED"
  ) {
    return res.status(400).json({
      message: "L'approbation du Ministre est requise avant l'approbation finale.",
    });
  }

  if (status === "APPROVED") {
    await prisma.user.update({
      where: { id: request.company.userId },
      data: { status: "APPROVED" },
    });
  }

  await prisma.notification.create({
    data: {
      userId: request.company.userId,
      title: status === "APPROVED" ? "Compte approuvé" : "Demande mise à jour",
      message:
        status === "APPROVED"
          ? "Votre compte exportateur a été approuvé. Vous pouvez maintenant vous connecter."
          : `Le statut de votre demande de révision a été mis à jour : ${status}.`,
      isRead: false,
    },
  });

  await logActivity({
    userId: user.id,
    action: status === "APPROVED" ? "APPROVE_REQUEST" : `${status}_REQUEST`,
    entity: "RegistrationRequest",
    entityId: request.id,
  });

  res.status(200).json(request);
};

// ---------- ADMIN — read, now logged ----------
const getApprovedExporters = async (req, res) => {
  try {
    const user = req.user;

    const companies = await prisma.company.findMany({
      where: {
        registrationRequests: {
          some: { status: "APPROVED" },
        },
      },
      select: {
        id: true,
        commName: true,
        rne: true,
        matFisc: true,
        activity: true,
        governorate: true,
        city: true,
        address: true,
        phone: true,
        nationality: true,
        isResident: true,
        isRented: true,
        labName: true,
        exportType : true,
        user: { select: { name: true, email: true } },
        registrationRequests: {
          where: { status: "APPROVED" },
          orderBy: { reviewedAt: "desc" },
          take: 1,
          select: { reviewedAt: true },
        },
      },
    });

    const exporters = companies.map((c) => ({
      ...c,
      approvedAt: c.registrationRequests[0]?.reviewedAt,
      registrationRequests: undefined, 
    }));

    await logActivity({
      userId: user.id,
      action: "VIEW_APPROVED_EXPORTERS",
      entity: "Company",
      entityId: "ALL",
    });

    res.status(200).json({ exporters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getRequestRegis,
    getAllRequestRegis,
    getRequestRegisById,
    addRequest,
    getRequestRegisByIdAdmin,
    updateRequestStatus,
    getApprovedExporters

}