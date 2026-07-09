const adminCheck = (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            error: "Authentication required",
        });
    }

    if (user.role !== "ADMIN") {
        return res.status(403).json({
            error: "Forbidden",
        });
    }

    next();
};

module.exports = adminCheck;