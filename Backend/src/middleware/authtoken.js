const { jwtVerify } = require("jose");

const secretRefresh = new TextEncoder().encode(process.env.SECRET_KEY_REFRESH);


const authenticateToken = async (req, res, next) => {
    try {
        
        const token = req.cookies.tokenRefresh;
 
        if (!token) {
            return res.status(401).json({
                error: "No refresh token found"
            });
        }
        

        const { payload } = await jwtVerify(token, secretRefresh);

        req.user = payload;

        next();

    } catch (err) {

        return res.status(401).json({
            error: err.message
        });

    }
};

module.exports = authenticateToken;