const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createInstance = async (req, res) => {
  try {
    const { exportRequestIds, memberIds, meetingDate, reportFileUrl } = req.body;

    if (!Array.isArray(exportRequestIds) || exportRequestIds.length === 0) {
      return res.status(400).json({ message: "Aucune demande sélectionnée" });
    }
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "Aucun membre sélectionné" });
    }

   
    const requests = await prisma.exportRequest.findMany({
      where: { id: { in: exportRequestIds } },
    });

    const invalid = requests.filter((r) => r.status !== "SENT");
    if (invalid.length > 0) {
      return res.status(409).json({
        message: "Certaines demandes ne sont plus disponibles pour une nouvelle instance",
        invalidIds: invalid.map((r) => r.id),
      });
    }

    const instance = await prisma.$transaction(async (tx) => {
      const created = await tx.instance.create({
        data: {
          meetingDate: meetingDate ? new Date(meetingDate) : new Date(),
          reportFileUrl: reportFileUrl ?? null,
          members: {
            create: memberIds.map((userId) => ({ userId })),
          },
        },
      });

      await tx.exportRequest.updateMany({
        where: { id: { in: exportRequestIds } },
        data: {
          instanceId: created.id,
          status: "UNDER_COMMITTEE_REVIEW",
        },
      });

      return created;
    });

    res.status(201).json(instance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInstances = async (req, res) => {
  try {
    const instances = await prisma.instance.findMany({
      orderBy: { meetingDate: "desc" },
      include: {
        members: { include: { user: { select: { id: true, name: true, role: true } } } },
        exportRequests: {
          select: {
            id: true,
            client: true,
            requestedKg: true,
            status: true,
            agrim: { select: { reference: true } },
          },
        },
      },
    });

    res.status(200).json({ instances });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInstanceById = async (req, res) => {
  try {
    const instance = await prisma.instance.findUnique({
      where: { id: req.params.id },
      include: {
        members: { include: { user: { select: { id: true, name: true, role: true } } } },
        exportRequests: {
          include: {
            company: { select: { commName: true } },
            agrim: true,
            documents: true,
          },
        },
      },
    });

    if (!instance) return res.status(404).json({ message: "Instance introuvable" });

    res.status(200).json(instance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInstance, getInstances, getInstanceById };