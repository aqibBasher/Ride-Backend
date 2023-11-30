const router = require('express').Router();

const { getAllBookings, getOneBooking } = require('../../../controllers/webservices/xride-business/bookingController');

router.get('/get-all-bookings/:car_rental_id', getAllBookings);
router.get('/get-one-booking/:booking_id/:car_rental_id', getOneBooking);

module.exports = router;