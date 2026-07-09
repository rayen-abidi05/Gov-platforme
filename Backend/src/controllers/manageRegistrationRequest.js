const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();

const getRequestRegis = async(req,res) => {
    try{
        
        const user = req.user;
        const requests = await prisma.registrationRequest.findMany({
            where : {
                company : {
                    userId : user.id
                }
            },
            orderBy: {
            createdAt: "desc",
            }
        })
         res.status(200).json ({requests})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}

const getRequestRegisById = async(req,res) => {
    try{
        
        const user = req.user;
        const {id} = req.params
        const request = await prisma.registrationRequest.findFirst({
            where : {
                id : id,
                company : {
                    userId : user.id
                },
                
            },
            
        })
        if (!request) {
            return res.status(404).json({
                message: "Request not found",
            });
            }
                
        res.status(200).json ({request})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}
const getAllRequestRegis = async(req,res) => {
    try{
        
       
        const requests = await prisma.registrationRequest.findMany({
           
            orderBy: {
                createdAt: "desc",
            }
        })
         res.status(200).json ({requests})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}
const addRequest = async(req,res) => {
    
}
module.exports = {
    getRequestRegis,
    getAllRequestRegis,
    getRequestRegisById,
    addRequest

}