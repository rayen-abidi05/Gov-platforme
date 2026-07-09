const {jwtVerify,SignJWT} = require ("jose")


const secret = new TextEncoder().encode(process.env.SECRET_KEY);
const secretRefresh = new TextEncoder().encode(process.env.SECRET_KEY_REFRESH);
const refresh = async (req, res) => {
    try{
        const token = req.cookies.tokenRefresh;
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        const { payload } = await jwtVerify(token, secretRefresh);
         const token_access = await new SignJWT({ id :payload.id ,email: payload.email,name : payload.name ,role: payload.role})
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('2min')
                .sign(secret);
            res.cookie('access_token', token_access, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge:  2 * 60 * 1000
            });
            return res.status(200).json({"message":"token Refreshed"})
       
    }
    catch(error){
        return res.status(401).json({ error: "not Authorized" });
    }
    



}
module.exports = refresh;