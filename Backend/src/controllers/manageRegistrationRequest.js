const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();
const {addFiles} = require ("../controllers/files")
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
    try {
        const user = req.user
        const {note="",docType} = req.body;
        
       
        const company = await prisma.company.findUnique({
            where : {
                userId : user.id
            }
        });
        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }
        const files = req.files;

            const request = await prisma.registrationRequest.create({
                data: {
                    status: "PENDING",
                    notes: note,
                    companyId: company.id
                }
            });


            await addFiles(
                files,
                docTypes,
                request.id
            );


        return res.status(201).json({
                message: "Request created successfully"
            });
    } catch (error) {
        res.status(500).json ({"message" : error.message})
    }
}
module.exports = {
    getRequestRegis,
    getAllRequestRegis,
    getRequestRegisById,
    addRequest

}