const asyncHandler = require("express-async-handler");
const CarRental = require("../models/CarRentals");
const jwt = require("jsonwebtoken");

const protectCarRental = asyncHandler(async (req, res, next) => {
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
            req.user = await CarRental.findOne({
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

module.exports = { protectCarRental };