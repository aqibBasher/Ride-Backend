const asyncHandler = require('express-async-handler');
const CarRental = require('../../models/CarRentals');
// const Branch = require('../../models/Branches');
const Booking = require('../../models/Bookings');
const Cars = require('../../models/Cars');
const User = require('../../models/User');

const getAllCarRentals = asyncHandler(async (req, res) => {
    try {
        const carRental = await CarRental.findAll();
        res.status(200).json(carRental);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

// const getOneCarRental = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.params;
//         const carRental = await CarRental.findOne({
//             where: { id },
//             include: [
//                 { model: Branch }
//             ]
//         });
//         res.status(200).json(carRental);
//     } catch (error) {
//         res.status(400);
//         throw error;
//     }
// });

const getCarRentalBookings = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findAll({
            include: [
                { model: User },
                {
                    model: Cars, where: { car_rental_id: id },
                    include: [{
                        model: CarRental, where: { id }
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

const verifyCarRental = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const carRental = await CarRental.update(
            { verified: true },
            { where: { id } }
        )
        res.status(200).json({ message: `${carRental[0]} Car rental updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const updateNewState = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const result = await CarRental.update(
            { new: false },
            { where: { id } }
        );
        res.status(200).json({ message: `${result[0]} Car rental updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    getCarRentalBookings,
    getAllCarRentals,
    // getOneCarRental,
    verifyCarRental,
    updateNewState
};