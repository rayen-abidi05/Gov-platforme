const {jwtVerify} = require ("jose")

const secret = new TextEncoder().encode(process.env.SECRET_KEY);
const authenticateToken = async (req, res, next) => {
    try{
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        const { payload } = await jwtVerify(token, secret);
        req.user = payload;
        next();
    }
    catch(error){
        res.status(401).json({ error: "not Authorized" });
    }
    



}
module.exports = authenticateToken;