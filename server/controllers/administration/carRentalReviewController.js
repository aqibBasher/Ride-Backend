const asyncHandler = require('express-async-handler');
const CarRentalReview = require('../../models/CarRentalReviews');

const getAllCarRentalReviews = asyncHandler(async (req, res) => {
    try {
        const carRentalReviews = await CarRentalReview.findAll();
        res.status(200).json(carRentalReviews);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    getAllCarRentalReviews
};