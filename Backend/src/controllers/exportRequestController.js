const { PrismaClient } = require("@prisma/client");
const  prisma  = new PrismaClient();


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

    const company = await prisma.company.findUnique({ where: { userId: user.id } });
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
      include: { company: { include: { user: true } }, agrim: true },
    });
    if (!request) return res.status(404).json({ message: "Demande introuvable" });

    if (request.status !== "UNDER_COMMITTEE_REVIEW") {
      return res.status(409).json({
        message: "Cette demande doit être en examen par l'instance avant décision",
      });
    }

    if (status === "APPROVED") {
      if (!request.agrimId || !request.agrim) {
        return res.status(409).json({
          message: "L'AGRIM doit être résolu (référence + limite) avant d'approuver cette demande",
        });
      }

      const consumedAgg = await prisma.exportRequest.aggregate({
        where: { agrimId: request.agrimId, status: "APPROVED" },
        _sum: { requestedKg: true },
      });
      const consumed = consumedAgg._sum.requestedKg ?? 0;
      const remaining = request.agrim.limitKg - consumed;

      if (request.requestedKg > remaining) {
        return res.status(409).json({
          message: `Solde AGRIM insuffisant (restant : ${remaining} kg, demandé : ${request.requestedKg} kg)`,
        });
      }
    }

    const updated = await prisma.exportRequest.update({
      where: { id },
      data: { status, reviewedAt: new Date() },
    });

    const title = status === "APPROVED" ? "Demande d'exportation approuvée" : "Demande d'exportation rejetée";
    const message =
      status === "APPROVED"
        ? `Votre demande d'exportation pour ${request.client} a été approuvée. L'autorisation d'exportation vous sera transmise.`
        : `Votre demande d'exportation pour ${request.client} a été rejetée.`;

    const recipients = [request.company.user.id];

    if (status === "APPROVED") {
      const diwanUsers = await prisma.user.findMany({ where: { role: "DIWAN_MEMBER" } });
      recipients.push(...diwanUsers.map((u) => u.id));
    }

    await prisma.notification.createMany({
      data: recipients.map((userId) => ({ userId, title, message })),
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
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