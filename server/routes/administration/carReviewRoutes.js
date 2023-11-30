const router = require('express').Router();

const { getAllCarReviews } = require('../../controllers/administration/carReviewsController');
const { protect } = require('../../middlewares/protect');

router.get('/get-all', protect, getAllCarReviews);

module.exports = router;