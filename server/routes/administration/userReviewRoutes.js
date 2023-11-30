const router = require('express').Router();

const { getAllUserReviews } = require('../../controllers/administration/userReviewController');
const { protect } = require('../../middlewares/protect');

router.get('/get-all', protect, getAllUserReviews);

module.exports = router;