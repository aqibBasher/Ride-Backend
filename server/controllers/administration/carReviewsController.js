const asyncHandler = require('express-async-handler');
const CarReview = require('../../models/CarReviews');

const getAllCarReviews = asyncHandler(async (req, res) => {
    try {
        const carReviews = await CarReview.findAll();
        res.status(200).json(carReviews);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    getAllCarReviews
};