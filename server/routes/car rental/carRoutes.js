const router = require('express').Router();

const {
    getAllRentalsCars, getRental, getRentalReview,
    updateVerifiedCarRental, publishAllCars,
    viewedVerifiedCars
} = require('../../controllers/car rental/carController');
const { protectCarRental } = require('../../middlewares/protectCarRental');

router.get('/get-all-rentals', protectCarRental, getAllRentalsCars);
router.get('/get-rental/:id', protectCarRental, getRental);
router.get('/get-rental-Reviews/:id', protectCarRental, getRentalReview);
router.put('/update-viewed', protectCarRental, viewedVerifiedCars);
router.put('/verified-car-retal/:id', protectCarRental, updateVerifiedCarRental);
router.put('/publish-all-cars', protectCarRental, publishAllCars);

module.exports = router;