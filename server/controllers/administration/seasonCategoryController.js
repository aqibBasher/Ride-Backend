const asyncHandler = require('express-async-handler');
const SeasonCategory = require('../../models/SeasonCategorys');

const getAllSeasonCategories = asyncHandler(async (req, res) => {
    try {
        const seasonCategories = await SeasonCategory.findAll();
        res.status(200).json(seasonCategories);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    getAllSeasonCategories
};