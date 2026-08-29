const { PrismaClient } = require("@prisma/client");
const  prisma  = new PrismaClient();
const { sendEmail } = require("../services/emailService");

const resolveAgrim = async (req, res) => {
  try {
    const { id } = req.params; 
    const { limitKg } = req.body;

    const request = await prisma.exportRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ message: "Demande introuvable" });
    if (request.agrimId) {
      return res.status(409).json({ message: "Cet AGRIM est déjà résolu pour cette demande" });
    }

    
    
    let agrim = await prisma.agrim.findUnique({ where: { reference: request.agrimReference } });
    if (!agrim) {
      if (!limitKg || limitKg <= 0) {
        return res.status(400).json({ message: "Limite AGRIM requise pour créer une nouvelle référence" });
      }
      agrim = await prisma.agrim.create({
        data: { reference: request.agrimReference, limitKg: parseFloat(limitKg) },
      });
    }

    
    await prisma.exportRequest.updateMany({
      where: { agrimReference: request.agrimReference, agrimId: null },
      data: { agrimId: agrim.id },
    });

    res.status(200).json(agrim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExportRequest = async (req, res) => {
  try {
    const user = req.user;
    const { client, agrimReference, requestedKg } = req.body;
    const files = req.files;

    if (!client || !agrimReference || !requestedKg) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const requiredDocs = ["AGRIM", "CONTRACT", "MINISTERIAL_LETTER"];
    const missing = requiredDocs.filter((doc) => !files?.[doc]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Documents manquants : ${missing.join(", ")}` });
    }

    const company = await prisma.company.findUnique({ where: { userId: user.id }, });
    if (!company) {
      return res.status(404).json({ message: "Entreprise introuvable" });
    }

    const existingAgrim = await prisma.agrim.findUnique({ where: { reference: agrimReference } });

    const exportRequest = await prisma.$transaction(async (tx) => {
      const created = await tx.exportRequest.create({
        data: {
          client,
          agrimReference,
          requestedKg: parseFloat(requestedKg),
          status: "SENT",
          companyId: company.id,
          agrimId: existingAgrim?.id ?? null,
        },
      });

      const documents = requiredDocs.map((docType) => {
        const file = files[docType][0];
        return {
          fileName: file.originalname,
          fileUrl: file.path,
          fileType: file.mimetype,
          size: file.size,
          DocType: docType,
          exportRequestId: created.id,
        };
      });

      await tx.document.createMany({ data: documents });

      return created;
    });
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
      await prisma.notification.createMany({
            data: admins.map((admin) => ({
                userId: admin.id,
                title: "Nouvelle demande d'exportation",
                message: `${company.commName} a soumis une nouvelle demande d'exportation.`,
                isRead: false,
            })),
        });

    res.status(201).json(exportRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const decideExportRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const request = await prisma.exportRequest.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            user: true,
          },
        },
        agrim: true,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: "Demande introuvable",
      });
    }

    if (request.status !== "UNDER_COMMITTEE_REVIEW") {
      return res.status(409).json({
        message:
          "Cette demande doit être en examen par l'instance avant décision",
      });
    }

    /* --------------------------------
       APPROVAL VALIDATION
    -------------------------------- */

    if (status === "APPROVED") {
      if (!request.agrimId || !request.agrim) {
        return res.status(409).json({
          message:
            "L'AGRIM doit être résolu (référence + limite) avant d'approuver cette demande",
        });
      }

      const consumedAgg = await prisma.exportRequest.aggregate({
        where: {
          agrimId: request.agrimId,
          status: "APPROVED",
        },
        _sum: {
          requestedKg: true,
        },
      });

      const consumed = consumedAgg._sum.requestedKg ?? 0;
      const remaining = request.agrim.limitKg - consumed;

      if (request.requestedKg > remaining) {
        return res.status(409).json({
          message: `Solde AGRIM insuffisant (restant : ${remaining} kg, demandé : ${request.requestedKg} kg)`,
        });
      }
    }

    /* --------------------------------
       UPDATE REQUEST
    -------------------------------- */

    const updated = await prisma.exportRequest.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
      },
    });

    /* --------------------------------
       NOTIFICATION
    -------------------------------- */

    const title =
      status === "APPROVED"
        ? "Demande d'exportation approuvée"
        : "Demande d'exportation rejetée";

    const message =
      status === "APPROVED"
        ? `Votre demande d'exportation pour ${request.client} a été approuvée. L'autorisation d'exportation vous sera transmise.`
        : `Votre demande d'exportation pour ${request.client} a été rejetée.`;

    const recipients = [request.company.user.id];

    if (status === "APPROVED") {
      const diwanUsers = await prisma.user.findMany({
        where: {
          role: "DIWAN_MEMBER",
        },
      });

      recipients.push(...diwanUsers.map((u) => u.id));
    }

    await prisma.notification.createMany({
      data: recipients.map((userId) => ({
        userId,
        title,
        message,
      })),
    });

    /* --------------------------------
       EMAIL DESIGN
    -------------------------------- */

    const isApproved = status === "APPROVED";

    const statusColor = isApproved ? "#2f6b3f" : "#c0392b";
    const statusBackground = isApproved ? "#edf7ef" : "#fdf0ef";
    const statusBorder = isApproved ? "#c9e6cf" : "#f2c7c3";

    const statusLabel = isApproved ? "Demande approuvée" : "Demande rejetée";

    const statusIcon = isApproved ? "✓" : "×";

    const emailTitle = isApproved
      ? "Votre demande d'exportation a été approuvée"
      : "Votre demande d'exportation a été rejetée";

    const emailMessage = isApproved
      ? `
        Votre demande d'exportation pour
        <strong>${request.client}</strong>
        a été approuvée.
        <br><br>
        L'autorisation d'exportation vous sera transmise prochainement.
      `
      : `
        Votre demande d'exportation pour
        <strong>${request.client}</strong>
        a été rejetée.
        <br><br>
        Nous vous invitons à consulter votre espace exportateur
        pour obtenir plus d'informations.
      `;

    await sendEmail({
      to: request.company.user.email,

      subject: emailTitle,

      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${emailTitle}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f6f4;
    font-family:Arial, Helvetica, sans-serif;
    color:#18251c;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#f4f6f4;"
  >

    <tr>
      <td align="center" style="padding:40px 20px;">

        <!-- Main container -->

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:600px;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            border:1px solid #e3e8e3;
          "
        >

          <!-- Header -->

          <tr>
            <td
              style="
                padding:28px 32px;
                background:#17351f;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
              >

                <tr>

                  <td>

                    <div
                      style="
                        font-size:22px;
                        font-weight:700;
                        color:#ffffff;
                        letter-spacing:-0.3px;
                      "
                    >
                      Olex-TN
                    </div>

                    <div
                      style="
                        margin-top:5px;
                        font-size:12px;
                        color:#d8e5da;
                      "
                    >
                      Plateforme d'exportation de l'huile d'olive
                    </div>

                  </td>

                  <td
                    align="right"
                    style="
                      font-size:26px;
                      color:#d4af37;
                    "
                  >
                    ●
                  </td>

                </tr>

              </table>

            </td>
          </tr>


          <!-- Status -->

          <tr>

            <td style="padding:36px 32px 10px;">

              <div
                style="
                  display:inline-block;
                  padding:8px 13px;
                  border-radius:20px;
                  background:${statusBackground};
                  border:1px solid ${statusBorder};
                  color:${statusColor};
                  font-size:12px;
                  font-weight:700;
                "
              >

                <span
                  style="
                    display:inline-block;
                    width:20px;
                    height:20px;
                    line-height:20px;
                    text-align:center;
                    border-radius:50%;
                    background:${statusColor};
                    color:#ffffff;
                    margin-right:6px;
                  "
                >
                  ${statusIcon}
                </span>

                ${statusLabel}

              </div>

            </td>

          </tr>


          <!-- Content -->

          <tr>

            <td style="padding:15px 32px 32px;">

              <h1
                style="
                  margin:0;
                  font-size:28px;
                  line-height:1.25;
                  color:#17351f;
                  letter-spacing:-0.5px;
                "
              >
                ${emailTitle}
              </h1>


              <p
                style="
                  margin:18px 0 0;
                  font-size:15px;
                  line-height:1.7;
                  color:#5d685f;
                "
              >
                Bonjour
                <strong style="color:#17351f;">
                  ${request.company.commName}
                </strong>,
              </p>


              <p
                style="
                  margin:12px 0 0;
                  font-size:15px;
                  line-height:1.7;
                  color:#5d685f;
                "
              >
                ${emailMessage}
              </p>


              <!-- Request information -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  margin-top:26px;
                  background:#f7f9f7;
                  border:1px solid #e4e9e4;
                  border-radius:12px;
                "
              >

                <tr>

                  <td
                    style="
                      padding:18px 20px;
                      font-size:13px;
                      color:#7a837b;
                    "
                  >
                    Référence de la demande
                  </td>

                  <td
                    align="right"
                    style="
                      padding:18px 20px;
                      font-size:13px;
                      font-weight:700;
                      color:#17351f;
                    "
                  >
                    ${request.id}
                  </td>

                </tr>

                <tr>

                  <td
                    style="
                      padding:0 20px 18px;
                      font-size:13px;
                      color:#7a837b;
                    "
                  >
                    Client
                  </td>

                  <td
                    align="right"
                    style="
                      padding:0 20px 18px;
                      font-size:13px;
                      font-weight:700;
                      color:#17351f;
                    "
                  >
                    ${request.client}
                  </td>

                </tr>

                <tr>

                  <td
                    style="
                      padding:0 20px 18px;
                      font-size:13px;
                      color:#7a837b;
                    "
                  >
                    Quantité demandée
                  </td>

                  <td
                    align="right"
                    style="
                      padding:0 20px 18px;
                      font-size:13px;
                      font-weight:700;
                      color:#17351f;
                    "
                  >
                    ${request.requestedKg.toLocaleString("fr-FR")} kg
                  </td>

                </tr>

                <tr>

                  <td
                    style="
                      padding:0 20px 18px;
                      font-size:13px;
                      color:#7a837b;
                    "
                  >
                    Statut
                  </td>

                  <td
                    align="right"
                    style="
                      padding:0 20px 18px;
                      font-size:13px;
                      font-weight:700;
                      color:${statusColor};
                    "
                  >
                    ${statusLabel}
                  </td>

                </tr>

              </table>


              <!-- CTA -->

              <div
                style="
                  text-align:center;
                  margin-top:30px;
                "
              >

                <a
                  href="${process.env.FRONTEND_URL}/espace"
                  style="
                    display:inline-block;
                    padding:13px 24px;
                    background:#17351f;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:8px;
                    font-size:14px;
                    font-weight:700;
                  "
                >
                  Accéder à mon espace
                </a>

              </div>

            </td>

          </tr>


          <!-- Footer -->

          <tr>

            <td
              style="
                padding:22px 32px;
                border-top:1px solid #e8ece8;
                background:#fafbfa;
              "
            >

              <p
                style="
                  margin:0;
                  font-size:12px;
                  line-height:1.6;
                  color:#8a928b;
                  text-align:center;
                "
              >
                Cet email a été envoyé automatiquement par Olex-TN.
                <br>
                Ministère de l'Agriculture, des Ressources hydrauliques et de la Pêche
              </p>

            </td>

          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
      `,
    });

    console.log(
      `Decision email sent to ${request.company.user.email}`
    );

   

    

    res.status(200).json(updated);

  } catch (error) {
    console.error("DECIDE EXPORT REQUEST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


const getExportRequests = async (req,res)=>{
  try {
    const requests = await prisma.exportRequest.findMany({
      include:{
        company:true,
        agrim:true,
        documents:true
      },
      orderBy:{
        createdAt:"desc"
      }
    });


    const requestsWithAgrim = await Promise.all(
      requests.map(async (request)=>{

        if(!request.agrim){
          return {
            ...request,
            agrim:null
          };
        }


        const consumedAgg = await prisma.exportRequest.aggregate({
          where:{
            agrimId: request.agrim.id,
            status:"APPROVED"
          },
          _sum:{
            requestedKg:true
          }
        });


        const consumed = consumedAgg._sum.requestedKg ?? 0;


        return {
          ...request,
          agrim:{
            id: request.agrim.id,
            reference: request.agrim.reference,
            limitKg: request.agrim.limitKg,
            consumedKg: consumed,
            remainingKg: request.agrim.limitKg - consumed
          }
        };

      })
    );


    res.json({
      requests: requestsWithAgrim
    });

  } catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};

const getExportRequest = async (req, res) => {
  const { id } = req.params;

  const request = await prisma.exportRequest.findUnique({
    where: { id },
    include: {
      company: true,
      agrim: true,
      documents: true
    }
  });

  if (!request) {
    return res.status(404).json({ message: "Demande introuvable" });
  }

  res.json({ request });
};

const getMyExportRequests = async (req,res)=>{
  const user = req.user;
  const company = await prisma.company.findUnique({ where: { userId: user.id } });
  if (!company) {
    return res.status(404).json({ message: "Entreprise introuvable" });
  }
  const requests = await prisma.exportRequest.findMany({
    where: { companyId: company.id },
    include:{
      company:true,
      agrim:true,
      documents:true
    },
    orderBy:{
      createdAt:"desc"
    }
  });

  res.json({requests});
};

const getMyExportRequest = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id
    }
  });

  if (!company) {
    return res.status(404).json({
      message: "Entreprise introuvable"
    });
  }


  const request = await prisma.exportRequest.findUnique({
    where: {
      id,
      companyId: company.id
    },
    include: {
      company: true,
      agrim: {
        include: {
          exportRequests: {
            where: {
              status: "APPROVED"
            },
            select: {
              requestedKg: true
            }
          }
        }
      },
      documents: true
    }
  });


  if (!request) {
    return res.status(404).json({
      message: "Demande introuvable"
    });
  }


  let formattedAgrim = null;


  if (request.agrim) {

    const consumedKg = request.agrim.exportRequests.reduce(
      (total, exportRequest) => total + exportRequest.requestedKg,
      0
    );


    formattedAgrim = {
      id: request.agrim.id,
      reference: request.agrim.reference,
      limitKg: request.agrim.limitKg,
      consumedKg,
      remainingKg: Math.max(
        request.agrim.limitKg - consumedKg,
        0
      )
    };
  }


  const formattedRequest = {
    ...request,
    agrim: formattedAgrim
  };


  res.json({
    request: formattedRequest
  });
};

const getAgrimMonitoring = async (req, res) => {
  try {
    const agrims = await prisma.agrim.findMany({
      include: {
        exportRequests: {
          where: {
            status: "APPROVED",
          },
          select: {
            requestedKg: true,
          },
        },
      },
    });

    const result = agrims.map((agrim) => {

      const consumedKg = agrim.exportRequests.reduce(
        (sum, request) => sum + Number(request.requestedKg),
        0
      );

      return {
        reference: agrim.reference,
        limitKg: agrim.limitKg,
        consumedKg,
        remainingKg: agrim.limitKg - consumedKg,
      };
    });

    console.log(result);

    res.json({ agrims: result });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const sendToCommittee = async (req,res)=>{
  try {

    const {id}=req.params;

    const request = await prisma.exportRequest.findUnique({
      where:{id}
    });

    if(!request){
      return res.status(404).json({
        message:"Demande introuvable"
      });
    }


    if(request.status !== "SENT"){
      return res.status(409).json({
        message:"Cette demande est déjà traitée"
      });
    }


    const updated = await prisma.exportRequest.update({
      where:{id},
      data:{
        status:"UNDER_COMMITTEE_REVIEW"
      }
    });


    res.json(updated);

  } catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};
module.exports = { createExportRequest, 
  decideExportRequest, 
  resolveAgrim
  , getExportRequests
  , getExportRequest
  , getMyExportRequests
  , getMyExportRequest
  , getAgrimMonitoring,
  sendToCommittee
 };