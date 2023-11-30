const asyncHandler = require('express-async-handler');
const Booking = require('../../models/Bookings');
const CarRentals = require('../../models/CarRentals');
const CarRentalReview = require('../../models/CarRentalReviews');
const Car = require('../../models/Cars');
// const Features = require('../../models/Features');
// const Category = require('../../models/CarCategories');
const Categories = require('../../models/Categories');
const CarRentalReviews = require('../../models/CarRentalReviews');
// const SeasonsCategories = require('../../models/SeasonsCategories');
// const Decreasing = require('../../models/Decreasing');
 

const getAllRentalsCars = asyncHandler(async (req, res) => {
    try {
        const cars = await CarRentals.findAll();
        res.status(200).json(cars);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


const getRental = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const car = await CarRentals.findOne({
            where: { id },
            include: [
                { model: CarRentalReview },
                // { model: Features }
            ]
        });
        res.status(200).json(car);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getRentalReview = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const car = await CarRentalReviews.findOne({
            where: { id },
        });
        res.status(200).json(car);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const updateVerifiedCarRental = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // Update the car record in the database using the editForm data
        const updatedCar = await CarRentals.update(
            { verified: 1 },
            { where: { id } }
        );

        res.status(200).json({ message: `Car with ID ${id} updated.`, car: updatedCar });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const publishAllCars = asyncHandler(async (req, res) => {
    try {
        const [numUpdated, updatedCars] = await Car.update(
            { published: true },
            {
                where: { viewed: true, published: false, verified1: true, verified2: true, car_rental_id: req.user.id },
                include: [
                    { model: CarRental },
                    // { model: Features }
                ]
            });

        res.status(200).json({ numUpdated, updatedCars });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const viewedVerifiedCars = asyncHandler(async (req, res) => {
    try {
        const [numUpdated, updatedCars] = await Car.update(
            { viewed: true },
            {
                where: { viewed: false, published: false, verified1: true, verified2: true, car_rental_id: req.user.id },
                include: [
                    { model: CarRental },
                    // { model: Features }
                ]
            });

        res.status(200).json({ numUpdated, updatedCars });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = {
    getAllRentalsCars,
    getRentalReview,
    viewedVerifiedCars,
    publishAllCars,
    getRental,
    updateVerifiedCarRental,
};