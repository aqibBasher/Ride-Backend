const asyncHandler = require('express-async-handler');
const Categories = require('../../../models/Categories');
const getActiveCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Categories.findAll({
            where: { verified: true, live: true },
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getSpecificActiveCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const categories = await Categories.findAll({
            where: { categories_id: id, verified: true, live: true },
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = {
    getSpecificActiveCategory,
    getActiveCategories
};