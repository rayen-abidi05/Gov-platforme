const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();
const getActivityLogs = async (req, res) => {
  try {
    const { action, from, to, page = 1, limit = 20 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const where = {
      user: { role: "ADMIN" }, 
    };

    if (action) where.action = action;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [logs, total, distinctActions] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.activityLog.count({ where }),
      prisma.activityLog.findMany({
        where: { user: { role: "ADMIN" } },
        select: { action: true },
        distinct: ["action"],
      }),
    ]);

    res.status(200).json({
      logs,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      availableActions: distinctActions.map((a) => a.action),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getActivityLogs };