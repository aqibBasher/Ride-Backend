const router = require('express').Router();

const { getActiveCategories, getSpecificActiveCategory } = require('../../../controllers/webservices/xride/categoryController');

router.get('/get-all-active-categories', getActiveCategories);
router.get('/get-specific-active-category/:id', getSpecificActiveCategory);

module.exports = router;