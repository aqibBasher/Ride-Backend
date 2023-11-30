const router = require('express').Router();

const { getAllCarRentals, updateNewState, verifyCarRental, getCarRentalBookings } = require('../../controllers/administration/carRentalController');
const { protect } = require('../../middlewares/protect');

router.get('/get-all', protect, getAllCarRentals);
// router.get('/get-one/:id', protect, getOneCarRental);
router.put('/updates/:id', protect, updateNewState);
router.put('/verify/:id', protect, verifyCarRental);
router.get('/bookings/:id', protect, getCarRentalBookings);

module.exports = router;