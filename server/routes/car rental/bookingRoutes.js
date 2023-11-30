const router = require('express').Router();

const { updateNewState, getAllBookings, getAllBookingsHistory, finishBooking, getOneBooking, getBooking, getSupportContactBookings, addSupportContact } = require('../../controllers/car rental/bookingController');
const { protectCarRental } = require('../../middlewares/protectCarRental');
router.get('/get-all-available', protectCarRental, getAllBookings);
router.get('/get-all', protectCarRental, getAllBookings);
router.get('/get-all-history', protectCarRental, getAllBookingsHistory);
router.put('/updates/:id', protectCarRental, updateNewState);
router.get('/get-booking/:id', protectCarRental, getBooking);
// router.get('/get-one-cancelation/:id', protectCarRental, getOneCancelation);
router.get('/get-one-booking/:id', protectCarRental, getOneBooking);
router.post('/finish-booking', finishBooking);
router.get('/get-all-support-contacts', protectCarRental, getSupportContactBookings);
router.post('/add-support-contact', protectCarRental, addSupportContact);

module.exports = router;