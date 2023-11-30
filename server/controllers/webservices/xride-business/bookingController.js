const asyncHandler = require('express-async-handler');
const Booking = require('../../../models/Bookings');
// const CarRental = require('../../../models/CarRentals');
const User = require('../../../models/User');
// const Car = require('../../models/Cars');
const CarCategory = require('../../../models/Categories');
const Categories = require('../../../models/Categories');
// const CategoryPhotos = require('../../../models/CategoryPhotos');

const getAllBookings = asyncHandler(async (req, res) => {
    try {
        const { car_rental_id } = req.params;
        const bookings = await Booking.findAll({
            where: { booking_state: true },
            include: [
                { model: User },
                { model: CarCategory, where: { car_rental_id }, include: [{ model: Categories }] }
            ]
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getOneBooking = asyncHandler(async (req, res) => {
    try {
        const { booking_id, car_rental_id } = req.params;
        const booking = await Booking.findOne({
            where: { id: booking_id, booking_state: true },
            include: [
                { model: User },
                { model: CarCategory, where: { car_rental_id }, include: [{ model: Categories }] },
            ]
        });
        res.status(200).json(booking);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    getAllBookings,
    getOneBooking
};