const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

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

 const viewFile = async (req, res) => {
  const user = req.user;
    console.log(req.params.id )
  const file = await prisma.document.findFirst({
    where: { 
        id: req.params.id ,
        

    },
  });

console.log(file)
  if (!file) {
      return res.status(403).json({ message: "Access denied" });
    }

    
    const filePath = path.resolve(file.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }


  

  res.sendFile(filePath);
};

 const downloadFile = async (req, res) => {
  const user = req.user;

   const file = await prisma.document.findUnique({
    where: { 
        id: req.params.id ,
        

    },
  });

 if (!file) {
      return res.status(403).json({ message: "Access denied" });
    }

    
    const filePath = path.resolve(file.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }


  

  
  res.download(filePath, file.fileName);
};

module.exports = {
    getFiles,
    addFiles,
    viewFile,
    downloadFile
}