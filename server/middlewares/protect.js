const asyncHandler = require("express-async-handler");
const Administration = require("../models/Administration");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await Administration.findOne({
                where: { id: decoded.id },
                attributes: { exclude: ["password"] },
            });
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Not Authorized");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not Authorized, no token");
    }
});

module.exports = { protect };