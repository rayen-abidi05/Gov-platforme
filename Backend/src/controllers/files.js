const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();
const getFiles = async(req,res) => {
    try{
        const {registrationRequestId} = req.body;
        const user = req.user;
        const files = await prisma.document.findMany({
            where : {
                registrationRequest : {
                    company : {
                        userId : user.id
                    }
                }, 
                registrationRequestId : registrationRequestId
            }
        })
         res.status(200).json ({files})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}


module.exports = {
    getFiles
}