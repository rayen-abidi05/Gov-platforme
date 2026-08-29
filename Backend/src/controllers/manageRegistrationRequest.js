const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();
const {addFiles} = require ("../controllers/files")
const {logActivity} = require ("../lib/logActivity")
const { sendEmail } = require("../services/emailService");
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
                        rne: true,
                        activity: true,
                        nationality: true,
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
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const user = req.user;

    // First get the request
    const existingRequest = await prisma.registrationRequest.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            user: true,
          },
        },
        ministerFormulaire: true,
      },
    });

    if (!existingRequest) {
      return res.status(404).json({
        message: "Demande introuvable.",
      });
    }

    // Check minister approval BEFORE updating the request
    if (
      status === "APPROVED" &&
      !existingRequest.company.isResident &&
      existingRequest.ministerFormulaire?.status !== "APPROVED"
    ) {
      return res.status(400).json({
        message:
          "L'approbation du Ministre est requise avant l'approbation finale.",
      });
    }

    // Update request
    const request = await prisma.registrationRequest.update({
      where: { id },
      data: {
        status,
        notes,
        reviewedAt: new Date(),
      },
      include: {
        company: {
          include: {
            user: true,
          },
        },
        ministerFormulaire: true,
      },
    });

    // If approved, approve the exporter account
    if (status === "APPROVED") {
      await prisma.user.update({
        where: {
          id: request.company.userId,
        },
        data: {
          status: "APPROVED",
        },
      });
    }

    // Create in-app notification for exporter
    await prisma.notification.create({
      data: {
        userId: request.company.userId,

        title:
          status === "APPROVED"
            ? "Compte approuvé"
            : "Demande mise à jour",

        message:
          status === "APPROVED"
            ? "Votre compte exportateur a été approuvé. Vous pouvez maintenant vous connecter."
            : `Le statut de votre demande a été mis à jour : ${status}.`,

        isRead: false,
      },
    });

    
    await sendEmail({
      to: request.company.user.email,

      subject:
        status === "APPROVED"
          ? "Votre demande d'enregistrement a été approuvée"
          : "Mise à jour de votre demande d'enregistrement",

     
        html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Olex-TN</title>
        </head>

        <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f5f0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #17210f;
        ">

        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="background-color: #f4f5f0; padding: 40px 16px;"
        >
            <tr>
            <td align="center">

                <!-- Main container -->
                <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    max-width: 560px;
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #e5e8df;
                    box-shadow: 0 8px 30px rgba(23, 33, 15, 0.08);
                "
                >

                <!-- Header -->
                <tr>
                    <td
                    style="
                        padding: 26px 32px;
                        background-color: #17210f;
                    "
                    >
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td>
                            <div
                            style="
                                font-size: 22px;
                                font-weight: 700;
                                letter-spacing: -0.5px;
                                color: #f8f5ea;
                            "
                            >
                            Olex<span style="color: #d4a94c;">-TN</span>
                            </div>

                            <div
                            style="
                                margin-top: 4px;
                                font-size: 11px;
                                letter-spacing: 1.5px;
                                text-transform: uppercase;
                                color: rgba(248,245,234,0.55);
                            "
                            >
                            Plateforme officielle
                            </div>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td style="padding: 40px 32px 32px;">

                    <!-- Status icon -->
                    <div
                        style="
                        width: 48px;
                        height: 48px;
                        line-height: 48px;
                        text-align: center;
                        border-radius: 50%;
                        background-color: #eef5e8;
                        color: #55733c;
                        font-size: 22px;
                        margin-bottom: 24px;
                        "
                    >
                        ✓
                    </div>

                    <h1
                        style="
                        margin: 0;
                        font-size: 24px;
                        line-height: 1.3;
                        font-weight: 650;
                        letter-spacing: -0.4px;
                        color: #17210f;
                        "
                    >
                        ${
                        status === "APPROVED"
                            ? "Votre demande a été approuvée"
                            : "Mise à jour de votre demande"
                        }
                    </h1>

                    <p
                        style="
                        margin: 14px 0 0;
                        font-size: 15px;
                        line-height: 1.7;
                        color: #5f6758;
                        "
                    >
                        Bonjour ${request.company.commName},
                    </p>

                    ${
                        status === "APPROVED"
                        ? `
                            <p
                            style="
                                margin: 18px 0 0;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #5f6758;
                            "
                            >
                            Nous avons le plaisir de vous informer que votre
                            demande d'exportation a été
                            <strong style="color: #17210f;">
                                approuvée
                            </strong>.
                            </p>

                            <div
                            style="
                                margin-top: 24px;
                                padding: 16px 18px;
                                border-radius: 10px;
                                background-color: #f5f8f2;
                                border: 1px solid #e1e8d9;
                            "
                            >
                            <div
                                style="
                                font-size: 11px;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                color: #7b8374;
                                margin-bottom: 6px;
                                "
                            >
                                Référence de la demande
                            </div>

                            <div
                                style="
                                font-size: 14px;
                                font-weight: 600;
                                color: #17210f;
                                word-break: break-all;
                                "
                            >
                                ${request.id}
                            </div>
                            </div>

                            <p
                            style="
                                margin: 24px 0 0;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #5f6758;
                            "
                            >
                            Votre compte exportateur est maintenant actif.
                            Vous pouvez accéder à votre espace et poursuivre
                            vos démarches d'exportation.
                            </p>

                            <!-- CTA -->
                            <table
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-top: 28px;"
                            >
                            <tr>
                                <td
                                style="
                                    border-radius: 9px;
                                    background-color: #17210f;
                                "
                                >
                                <a
                                    href="${process.env.FRONTEND_URL}/espace"
                                    style="
                                    display: inline-block;
                                    padding: 13px 22px;
                                    font-size: 14px;
                                    font-weight: 600;
                                    color: #ffffff;
                                    text-decoration: none;
                                    border-radius: 9px;
                                    "
                                >
                                    Accéder à mon espace →
                                </a>
                                </td>
                            </tr>
                            </table>
                        `
                        : `
                            <p
                            style="
                                margin: 18px 0 0;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #5f6758;
                            "
                            >
                            Le statut de votre demande
                            <strong style="color: #17210f;">
                                ${request.id}
                            </strong>
                            a été mis à jour.
                            </p>

                            ${
                            notes
                                ? `
                                <div
                                    style="
                                    margin-top: 24px;
                                    padding: 16px 18px;
                                    border-radius: 10px;
                                    background-color: #f8f8f5;
                                    border: 1px solid #e5e8df;
                                    "
                                >
                                    <div
                                    style="
                                        font-size: 11px;
                                        text-transform: uppercase;
                                        letter-spacing: 1px;
                                        color: #7b8374;
                                        margin-bottom: 6px;
                                    "
                                    >
                                    Message du Ministère
                                    </div>

                                    <div
                                    style="
                                        font-size: 14px;
                                        line-height: 1.6;
                                        color: #3e4639;
                                    "
                                    >
                                    ${notes}
                                    </div>
                                </div>
                                `
                                : ""
                            }
                        `
                    }

                    </td>
                </tr>

                <!-- Divider -->
                <tr>
                    <td style="padding: 0 32px;">
                    <div
                        style="
                        height: 1px;
                        background-color: #e9ebe5;
                        "
                    ></div>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td
                    style="
                        padding: 24px 32px 28px;
                        text-align: center;
                    "
                    >
                    <p
                        style="
                        margin: 0;
                        font-size: 12px;
                        line-height: 1.6;
                        color: #8a9183;
                        "
                    >
                        Cet email a été envoyé automatiquement par Olex-TN.
                    </p>

                    <p
                        style="
                        margin: 6px 0 0;
                        font-size: 12px;
                        color: #a0a69a;
                        "
                    >
                        Plateforme officielle du Ministère de l'Agriculture
                    </p>
                    </td>
                </tr>

                </table>

                <!-- Bottom text -->
                <p
                style="
                    margin: 18px 0 0;
                    font-size: 11px;
                    color: #9aa092;
                    text-align: center;
                "
                >
                © ${new Date().getFullYear()} Olex-TN
                </p>

            </td>
            </tr>
        </table>

        </body>
        </html>


      `,
    });

    
    

    return res.status(200).json(request);
  } catch (error) {
    console.error("UPDATE REQUEST STATUS ERROR:", error);

    return res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour de la demande.",
    });
  }
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