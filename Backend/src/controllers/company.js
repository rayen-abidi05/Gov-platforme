const {PrismaClient} = require ("@prisma/client")
const prisma = new PrismaClient();


const getCompany = async (req,res) =>{
    try {
        const user = req.user;
        const company = await prisma.company.findUnique ({
            where : {
                userId : user.id
            },
            

        });
        if (!company){
            return res.status(404).json({
                "error" : "no company found"
            })
        }
        return res.status(200).json({
            company
        })

    } catch (error) {
        return res.status(500).json ({"message" : error.message})
    }
}
module.exports = {
    getCompany,
    
}