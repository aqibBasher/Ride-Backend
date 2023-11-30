const router = require('express').Router();

const { updateNewState, getAllBookings, getOneBooking, getOneCancelation, getBooking } = require('../../controllers/administration/bookingController');
const { protect } = require('../../middlewares/protect');

router.get('/get-all', protect, getAllBookings);
router.get('/get-booking/:id', protect, getBooking);
router.put('/updates/:id', protect, updateNewState);
router.get('/get-one-cancelation/:id', protect, getOneCancelation);
router.get('/get-one-booking/:id', protect, getOneBooking);

module.exports = router;