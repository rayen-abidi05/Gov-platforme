const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();
const getFiles = async(req,res) => {
    try{
        const {id} = req.params;
        const user = req.user;
        const files = await prisma.document.findMany({
            where : {
                registrationRequest : {
                    company : {
                        userId : user.id
                    }
                }, 
                registrationRequestId : id
            }
        })
         res.status(200).json ({files})
    }
    catch(error) {
        res.status(500).json ({"message" : error.message})
    }
}
const addFiles = async (files, regisId) => {
    try {

        const documents = [];

        for (const docType in files) {
            const file = files[docType][0];

            documents.push({
                fileName: file.originalname,
                fileUrl: file.path,
                fileType: file.mimetype,
                size: file.size,
                DocType: docType,
                registrationRequestId: regisId
            });
        }

        const saved = await prisma.document.createMany({
            data: documents
        });

        return saved;

    } catch (err) {
        throw err;
    }
};

module.exports = {
    getFiles,
    addFiles
}