const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createInstance = async (req, res) => {
  try {

    const {
      exportRequestIds: exportRequestIdsRaw,
      memberIds: memberIdsRaw,
      meetingDate
    } = req.body;


    const exportRequestIds = JSON.parse(
      exportRequestIdsRaw || "[]"
    );

    const memberIds = JSON.parse(
      memberIdsRaw || "[]"
    );


    if (!Array.isArray(exportRequestIds) || exportRequestIds.length === 0) {
      return res.status(400).json({
        message:"Aucune demande sélectionnée"
      });
    }


    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({
        message:"Aucun membre sélectionné"
      });
    }



    const requests = await prisma.exportRequest.findMany({
      where:{
        id:{
          in:exportRequestIds
        }
      }
    });



    if(requests.length !== exportRequestIds.length){
      return res.status(404).json({
        message:"Une demande est introuvable"
      });
    }



    const invalid = requests.filter(
      r=>r.status !== "SENT" 
    );


    if(invalid.length){
      return res.status(409).json({
        message:"Certaines demandes ne sont plus disponibles",
        invalidIds:invalid.map(r=>r.id)
      });
    }




    const members = await prisma.user.findMany({
      where:{
        id:{
          in:memberIds
        }
      }
    });


    if(members.length !== memberIds.length){
      return res.status(404).json({
        message:"Un membre est introuvable"
      });
    }




    const instance = await prisma.$transaction(async(tx)=>{


      let reportDocument = null;


      if(req.file){

        reportDocument = await tx.document.create({

          data:{
            fileName:req.file.originalname,

            fileType:req.file.mimetype,

            fileUrl:`/uploads/${req.file.filename}`,

            DocType:"INSTANCE_REPORT",

            size:req.file.size
          }

        });

      }



      const created = await tx.instance.create({

        data:{

          meetingDate:meetingDate
          ? new Date(meetingDate)
          : new Date(),


          reportDocumentId:reportDocument?.id ?? null,


          members:{
            create:memberIds.map(userId=>({
              userId
            }))
          }

        }

      });




      await tx.exportRequest.updateMany({

        where:{
          id:{
            in:exportRequestIds
          }
        },


        data:{
          instanceId:created.id,
          status:"UNDER_COMMITTEE_REVIEW"
        }

      });



      return created;

    });



    return res.status(201).json(instance);



  }catch(error){

    console.error(error);

    return res.status(500).json({
      message:error.message
    });

  }
};

const getInstances = async (req, res) => {
  try {
    const instances = await prisma.instance.findMany({
      orderBy: { meetingDate: "desc" },
      include: {
        members: { include: { user: { select: { id: true, name: true, role: true } } } },
        exportRequests: {
          select: {
            id: true,
            client: true,
            requestedKg: true,
            status: true,
            agrim: { select: { reference: true } },
          },
        },
      },
    });

    res.status(200).json({ instances });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInstanceById = async(req,res)=>{

 const {id}=req.params;


 const instance = await prisma.instance.findUnique({

  where:{
    id
  },


  include:{

    members:{
      include:{
        user:true
      }
    },


    reportDocument:true,


    exportRequests:{
      include:{
        agrim:true
      }
    }

  }

 });



 if(!instance){
  return res.status(404).json({
    message:"Instance introuvable"
  });
 }


 res.json(instance);

};

const getEligibleMembers = async (req,res)=>{
  try {

    const members = await prisma.user.findMany({
      where:{
        role:"COMMITTEE_MEMBER",
        
      },
      select:{
        id:true,
        name:true,
        email:true,
        role:true
      }
    });


    res.json(members);

  } catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};

module.exports = { createInstance, getInstances, getInstanceById, getEligibleMembers };