const asyncHandler = require('express-async-handler');
const Booking = require('../../models/Bookings');
const CarRental = require('../../models/CarRentals');
const User = require('../../models/User');
const Car = require('../../models/Cars');
const CarCategory = require('../../models/Categories');

const getAllBookings = asyncHandler(async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User },
                { model: CarCategory, include: [{ model: Categories }] },
                // {
                //     model: Car,
                //     include: [{
                //         model: CarRental,
                //     }]
                // }
            ],
            where: {
              booking_status: {
                [Op.in]: [-1, 0, 1, 2, 3], // Filter based on the specified booking_status values
              },
            },
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400);
        throw error;
    }
});


const getBooking = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findOne({
            where: { id },
            include: [
                { model: User },
                { model: CarCategory, include: [{ model: Categories }, { model: CategoryPhotos }] },
                // { model: User },
                // {
                //     model: Car,
                //     include: [{
                //         model: CarRental,
                //     }]
                // }
            ]
        });
        res.status(200).json(booking);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getOneBooking = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findOne({
            where: { id, booking_state: true },
            include: [
                { model: User },
                { model: CarCategory, include: [{ model: Categories }, { model: CategoryPhotos }] },
                {
                    model: Car,
                    include: [{
                        model: CarRental,
                    }]
                }
            ]
        });
        res.status(200).json(booking);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getOneCancelation = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findOne({
            where: { id, booking_state: false },
            include: [
                { model: User },
                { model: CarCategory, include: [{ model: Categories }] },
                {
                    model: Car,
                    include: [{
                        model: CarRental,
                    }]
                }
            ]
        });
        res.status(200).json(booking);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const updateNewState = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Booking.update(
            { new: false },
            { where: { id: id } }
        );
        res.status(200).json({ message: `${result[0]} bookings updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    getOneCancelation,
    updateNewState,
    getAllBookings,
    getOneBooking,
    getBooking,
};