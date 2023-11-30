const asyncHandler = require('express-async-handler');
const Season = require('../../models/Seasons');

const getAllSeasons = asyncHandler(async (req, res) => {
    try {
        const seasons = await Season.findAll();
        res.status(200).json(seasons);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    getAllSeasons
};