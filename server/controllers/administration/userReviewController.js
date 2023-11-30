const asyncHandler = require('express-async-handler');
const UserReview = require('../../models/UserReviews');

const getAllUserReviews = asyncHandler(async (req, res) => {
    try {
        const userReviews = await UserReview.findAll();
        res.status(200).json(userReviews);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    getAllUserReviews
};