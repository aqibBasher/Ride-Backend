const asyncHandler = require('express-async-handler');
const CarRentals = require('../../models/CarRentals');
const Car = require('../../models/Cars');
const Booking = require('../../models/Bookings');

const getAllCars = asyncHandler(async (req, res) => {
    try {
        const cars = await Car.findAll({
            include: [
                { model: CarRentals },
                { model: Booking }
            ]
        });
        res.status(200).json(cars);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getOneCar = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findOne({
            where: { id },
            include: [
                // { model: CarRentals, include: [{ model: Branches }] },
                {
                    model: Category, where: { car_rental_id: req.user.id },
                },
                {
                    model: Booking, include: [
                        {
                            model: Car, include: [{ model: CarRentals }]
                        }]
                }
            ]
        });
        res.status(200).json(car);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const verifyCar = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.update(
            { verified1: true },
            { where: { id } }
        )
        res.status(200).json({ message: `${car[0]} car  updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const verifyCarByAdmin = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.update(
            { verified1: true },
            { where: { id } }
        )
        res.status(200).json({ message: `${car[0]} car  updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

// const editCar = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.params;
//         const editForm = req.body;

//         // Check if photo is empty and retrieve previous photo if necessary
//         if (!editForm.photos) {
//             const car = await Car.findOne({ where: { id } });
//             editForm.photos = car.photos;
//         }

//         // Update the car record in the database using the editForm data
//         const updatedCar = await Car.update(editForm, { where: { id } });

//         res.status(200).json({ message: `Car with ID ${id} updated.`, car: updatedCar });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

const editCar = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const editForm = req.body;

        // Update the car record in the database using the editForm data
        const updatedCar = await Car.update(
            editForm,
            { where: { id } }
        );

        res.status(200).json({ message: `Car with ID ${id} updated.`, car: updatedCar });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const updateNewState = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Car.update(
            { new: false },
            { where: { id } }
        );
        res.status(200).json({ message: `${result[0]} bookings updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

//

const verifyAllCarsForOneCarRental = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.update(
            { verified2: true },
            { where: { car_rental_id: id } }
        )
        res.status(200).json({ message: `${car[0]} car  updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getAllCarsForOneCarRental = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const cars = await Car.findAll({
            where: { car_rental_id: id },
            include: [
                { model: CarRentals, where: { id } },
                { model: Booking },
            ]
        });
        res.status(200).json(cars);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

// const viewedVerifiedCars = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.params;
//         const [numUpdated, updatedCars] = await Car.update(
//             { viewedAdmin: true, new: false },
//             {
//                 where: { verified2: false, viewedAdmin: false, published: false, car_rental_id: id },
//             });

//         res.status(200).json({ numUpdated, updatedCars });
//     } catch (error) {
//         res.status(400);
//         throw error;
//     }
// });

// const getCarentalWithCars = asyncHandler(async (req, res) => {
//     try {
//         const cars = await CarRentals.findAll({
//             include: [
//                 { model: CarRentals },
//             ]
//         });
//         res.status(200).json(cars);
//     } catch (error) {
//         res.status(400);
//         throw error;
//     }
// });

module.exports = {
    verifyAllCarsForOneCarRental,
    getAllCarsForOneCarRental,
    // viewedVerifiedCars,
    verifyCarByAdmin,
    updateNewState,
    getAllCars,
    verifyCar,
    getOneCar,
    editCar
};