
const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();


async function logActivity({ userId, action, entity, entityId }) {
  try {
    await prisma.activityLog.create({
      data: { userId, action, entity, entityId },
    });
  } catch (err) {
    
    console.error("Failed to write activity log:", err);
  }
}

module.exports = { logActivity };