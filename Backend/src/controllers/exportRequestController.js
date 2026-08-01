const decideExportRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const request = await prisma.exportRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ message: "Demande introuvable" });

    if (request.status !== "UNDER_COMMITTEE_REVIEW") {
      return res.status(409).json({
        message: "Cette demande doit être en examen par l'instance avant décision",
      });
    }

    const updated = await prisma.exportRequest.update({
      where: { id },
      data: { status, reviewedAt: new Date() },
    });

 

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { /* ...existing exports, */ decideExportRequest };