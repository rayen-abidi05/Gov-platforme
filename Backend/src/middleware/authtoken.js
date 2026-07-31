const { jwtVerify } = require("jose");

const secretRefresh = new TextEncoder().encode(process.env.SECRET_KEY_REFRESH);


const authToken = async (req, res, next) => {
    try {
        console.log("Route reached")
        const token = req.cookie.tokenRefresh;
        console.log(token)
        if (!token) {
            return res.status(401).json({
                error: "No refresh token found"
            });
        }
        console.log("req.cookies =", req.cookies);

        const { payload } = await jwtVerify(token, secretRefresh);

        req.user = payload;

        next();

    } catch (err) {

        return res.status(401).json({
            error: err.message
        });

    }
};

module.exports = authToken;