const asyncHandler = require('express-async-handler');
const SupportContact = require('../../models/SupportContacts');
const Booking = require('../../models/Bookings');
const CarRental = require('../../models/CarRentals');
const User = require('../../models/User');
const Car = require('../../models/Cars');
// const Branch = require('../../models/Branches');
const Category = require('../../models/Categories');

const getAllSupportContacts = asyncHandler(async (req, res) => {
    try {
        const supportContacts = await SupportContact.findAll({
            include: [
                { model: Booking, include: { model: Car, include: { model: CarRental } } },
                { model: User },
                { model: CarRental }
            ]
        });
        res.status(200).json(supportContacts);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getOneSupportContact = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await SupportContact.findOne({
            where: { id },
            include: [
                { model: Booking, include: { model: Car, include: { model: CarRental } } },
                { model: User },
                { model: CarRental }
            ]
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const counts = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const activeCars = await Car.count({
            where: { car_rental_id: id, active: true, verified1: true, verified2: true, published: true }
        });
        const cars = await Car.count({
            where: { car_rental_id: id, verified1: true, verified2: true, published: true }
        });
        const categories = await Category.count({
            where: { car_rental_id: id }
        });
        const bookings = await Booking.count({
            include: [
                { model: Car, where: { car_rental_id: id } }
            ]
        });
        // const branches = await Branch.count({
        //     where: { car_rental_id: id }
        // });

        res.json({ activeCars, cars, categories, bookings });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const solved = asyncHandler(async (req, res) => {
    try {
        const currentDate = new Date(); // create a new date object with the current date and time
        const year = currentDate.getFullYear(); // get the current year
        const month = currentDate.getMonth() + 1; // get the current month (add 1 because it starts from 0)
        const day = currentDate.getDate(); // get the current day of the month
        const hours = currentDate.getHours(); // get the current hour
        const minutes = currentDate.getMinutes(); // get the current minute
        const seconds = currentDate.getSeconds(); // get the current second
        const { id } = req.params;
        const supportContact = await SupportContact.update(
            { solved: true, submited_date: `${year}-${month}-${day} ${hours + 3}:${minutes}:${seconds}` },
            { where: { id } }
        )
        res.status(200).json({ message: `${supportContact[0]} support contact updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const updateNewState = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const result = await SupportContact.update(
            { new: false },
            { where: { id: id } }
        );
        res.status(200).json({ message: `${result[0]} support contact updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    getAllSupportContacts,
    getOneSupportContact,
    updateNewState,
    solved,
    counts
};