const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();
const {addFiles} = require ("../controllers/files")
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
                
        res.status(200).json ({request})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}
const getAllRequestRegis = async(req,res) => {
    try{
        
        const requests = await prisma.registrationRequest.findMany({
            include: {
                company: {
                    select: {
                        commName: true,
                        matFisc: true,
                        governorate: true,
                        isRented: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                documents: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
         res.status(200).json ({requests})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}

const addRequest = async (req, res) => {
    try {
        const user = req.user;
        const { note = "" } = req.body;

        const company = await prisma.company.findUnique({
            where: {
                userId: user.id
            }
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        const files = req.files|| {};

        
        if (company.isRented && !files.RENTEDDECLARATION) {
            return res.status(400).json({
                message: "RENTEDDECLARATION is required"
            });
        }

        if (!company.isRented && !files.CERTIFICATIONOWNERSHIP) {
            return res.status(400).json({
                message: "CERTIFICATIONOWNERSHIP is required"
            });
        }

        const request = await prisma.registrationRequest.create({
            data: {
                status: "PENDING",
                notes: note,
                companyId: company.id
            }
        });

        await addFiles(
            files,
           
            request.id
        );

        return res.status(201).json({
            message: "Request created successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const request = await prisma.registrationRequest.update({
    where: { id },
    data: { status, notes, reviewedAt: new Date() },
    include: { company: true },
  });

  
  if (status === "APPROVED") {
    await prisma.user.update({
      where: { id: request.company.userId },
      data: { status: "APPROVED" },
    });
  }

  res.status(200).json(request);
};
module.exports = {
    getRequestRegis,
    getAllRequestRegis,
    getRequestRegisById,
    addRequest,
    getRequestRegisByIdAdmin,
    updateRequestStatus

}