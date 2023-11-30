const router = require('express').Router();

const { getAllCarRentalReviews } = require('../../controllers/administration/carRentalReviewController');
const { protect } = require('../../middlewares/protect');

router.get('/get-all', protect, getAllCarRentalReviews);

module.exports = router;