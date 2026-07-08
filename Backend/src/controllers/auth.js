const {SignJWT, jwtVerify} = require('jose');

const brypt = require('bcryptjs');


const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const secret = new TextEncoder().encode(process.env.SECRET_KEY);
const secretRefresh = new TextEncoder().encode(process.env.SECRET_KEY_REFRESH);

const login = async (req, res) => {
    try {
        
    const {  email , password } = req.body; 
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await brypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    const token = await new SignJWT({ id :user.id ,email: user.email,name : user.name ,role: user.role})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2min')
        .sign(secret);
    res.cookie('access_token', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge:  2 * 60 * 1000
    });
    const tokenRefresh = await new SignJWT({ id :user.id , email: user.email,name : user.name ,role: user.role})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secretRefresh);
    res.cookie('tokenRefresh', tokenRefresh, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.status(200).json({ "messgae" : "logged in!!!" });
}catch (error) {   
     res.status(500).json({ error : error.message });
}};
const registerUser = async (req, res,status=null) => {
    const { name, email, password, role } = req.body;

    try {
        const cryptedPassword = await brypt.hash(password, 10);
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password: cryptedPassword,
                role,
                status:status
            }
        });
        if(role==="EXPORTER"){
            const {commName,rne,activity,isResident,city,governorate,matFisc,address,phone,nationality,isRented,registerState,labName,userId } = req.body;
        const company = await prisma.Company.create({
                data:{
                    commName, 
                    rne,
                    activity,    
                    isResident,      
                    city,         
                    governorate,   
                    matFisc,       
                    address,     
                    phone,         
                    nationality,    
                    isRented,     
                    registerState, 
                    labName,    
                    userId:user.id,         
                }
            });
       };
        
    
    



    const token = await new SignJWT({  id :user.id ,email: user.email, name : user.name ,role: user.role})
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('2h')
                .sign(secret);
         res.cookie('access_token', token, {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                maxAge:  2 * 60 * 1000
            }); 
              
        const tokenRefresh = await new SignJWT({  id :user.id ,email: user.email,name : user.name ,role: user.role})
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('7d')
                .sign(secretRefresh);
                
        res.cookie('tokenRefresh', tokenRefresh, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }); 
        res.status(201).json({ "message":"user added"});
        
    } catch (error) {
        res.status(500).json({ error:error.message});
    }
};

const logout = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: false,
    sameSite: "lax",
    secure: false, 
    path: "/",
    maxAge: 2 * 60 * 1000,
  });
 
  res.clearCookie("tokenRefresh", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ message: "logged out" });
};

module.exports = {
    registerUser,
    login,
    logout
};