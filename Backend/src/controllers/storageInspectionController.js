const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const assignToInspa = async (req, res) => {
  try {
    const { id } = req.params; 

    const request = await prisma.registrationRequest.findUnique({
      where: { id },
      include: {
        ministerFormulaire: true,
        storageInspection: true,
        company: true,
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Dossier introuvable" });
    }

    if (!request.ministerFormulaire || request.ministerFormulaire.status !== "APPROVED") {
      return res.status(409).json({
        message: "Le formulaire ministériel doit être approuvé avant l'envoi à l'INSPA",
      });
    }

    if (request.storageInspection) {
      return res.status(409).json({ message: "Une inspection a déjà été assignée pour ce dossier" });
    }

    const inspaUser = await prisma.user.findFirst({ where: { role: "INSPA" } });
    if (!inspaUser) {
      return res.status(500).json({ message: "Aucun compte INSPA configuré" });
    }

    const [inspection] = await prisma.$transaction([
      prisma.storageInspection.create({
        data: {
          registrationRequestId: id,
          inspectorId: inspaUser.id,
          status: "PENDING",
        },
      }),
      prisma.notification.create({
        data: {
          userId: inspaUser.id,
          title: "Nouvelle inspection assignée",
          message: `Une inspection du lieu de stockage a été assignée pour le dossier de ${request.company.commName}.`,
        },
      }),
    ]);

    res.status(201).json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAssignedInspections = async (req, res) => {
  try {
    const inspections = await prisma.storageInspection.findMany({
      where: { inspectorId: req.user.id, status: "PENDING" },
      include: {
        registrationRequest: {
          include: { company: { select: { commName: true, governorate: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ inspections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllInspections = async (req, res) => {
  try {
    const inspections = await prisma.storageInspection.findMany({
      where: {
        inspectorId: req.user.id,
        status: { in: ["APPROVED", "REJECTED"] },
      },
      include: {
        registrationRequest: {
          include: { company: { select: { commName: true, governorate: true } } },
        },
      },
      orderBy: { inspectedAt: "desc" },
    });
    res.status(200).json({ inspections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInspectionHistory = async (req, res) => {
  try {
    const inspections = await prisma.storageInspection.findMany({
      where: { inspectorId: req.user.id },
      include: {
        registrationRequest: {
          include: { company: { select: { commName: true, governorate: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ inspections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeInspection = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status, notes } = req.body; 

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const inspection = await prisma.storageInspection.findUnique({
      where: { id },
      include: {
        registrationRequest: { include: { company: true } },
      },
    });

    if (!inspection) {
      return res.status(404).json({ message: "Inspection introuvable" });
    }

    if (inspection.inspectorId !== req.user.id) {
      return res.status(403).json({ message: "Cette inspection ne vous est pas assignée" });
    }

    if (inspection.status !== "PENDING") {
      return res.status(409).json({ message: "Cette inspection a déjà été traitée" });
    }

    const updated = await prisma.storageInspection.update({
      where: { id },
      data: { status, notes, inspectedAt: new Date() },
    });

 
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    const companyName = inspection.registrationRequest.company.commName;

    const notificationTitle =
      status === "APPROVED" ? "Inspection INSPA approuvée" : "Inspection INSPA rejetée";
    const notificationMessage =
      status === "APPROVED"
        ? `L'INSPA a approuvé le lieu de stockage du dossier de ${companyName}. Vous pouvez finaliser son inscription en Liste 2.`
        : `L'INSPA a rejeté le lieu de stockage du dossier de ${companyName}.`;

    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        title: notificationTitle,
        message: notificationMessage,
      })),
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllInspectionsAdmin = async (req, res) => {
  try {
    const inspections = await prisma.storageInspection.findMany({
      include: {
        registrationRequest: {
          include: { company: { select: { commName: true, governorate: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ inspections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  assignToInspa,
  getAssignedInspections,
  getAllInspections, 
  getInspectionHistory,
  completeInspection,
   getAllInspectionsAdmin,
};