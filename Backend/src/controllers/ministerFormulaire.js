const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getMinisterFormulaires = async (req, res) => {
  try {
    const { status } = req.query; 

    const formulaires = await prisma.ministerFormulaire.findMany({
      where: status ? { status } : {},
      include: {
        registrationRequest: {
          include: {
            documents: true,
            company: {
              select: {
                commName: true,
                rne: true,
                matFisc: true,
                nationality: true,
                user: { select: { name: true, email: true } },
              },
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.status(200).json({ formulaires });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewMinisterFormulaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const formulaire = await prisma.ministerFormulaire.findUnique({
      where: { id },
      include: {
        registrationRequest: { include: { company: { include: { user: true } } } },
      },
    });

    if (!formulaire) return res.status(404).json({ message: "Formulaire introuvable" });
    if (formulaire.status !== "PENDING") {
      return res.status(409).json({ message: "Ce formulaire a déjà été traité" });
    }

    const updated = await prisma.ministerFormulaire.update({
      where: { id },
      data: { status, notes, reviewedAt: new Date() },
    });

    const companyName = formulaire.registrationRequest.company.commName;

    if (status === "APPROVED") {
      
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: "Formulaire ministériel approuvé",
          message: `Le Ministre a approuvé le dossier de ${companyName}. Veuillez contacter l'INSPA pour la suite.`,
        })),
      });
    } else {
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: "Formulaire ministériel rejeté",
          message: `Le Ministre a rejeté le dossier de ${companyName}.`,
        })),
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMinisterFormulaires, reviewMinisterFormulaire };