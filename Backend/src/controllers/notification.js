const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();



const getNotifications = async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ notifications });
};
const getNotificationsAll = async (req, res) => {
  const notifications = await prisma.notification.findMany({
    
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ notifications });
};

const read = async(req,res) => {
    const {id} = req.params
    try{
        await prisma.notification.update({
            data : {
                isRead : true
            },
            where : {
                id 
            }
        })
        res.json({"message" : "updated"})
    }
    catch (err) {
        res.status(500).json({"error" : err.message})
    }
}


module.exports = {
    getNotifications,
    getNotificationsAll,
    read
}