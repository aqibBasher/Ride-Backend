const asyncHandler = require('express-async-handler');
const CarCategories = require('../../models/Categories');
const Categories = require('../../models/Categories');
const CarRental = require('../../models/CarRentals');
const Booking = require('../../models/Bookings');
const User = require('../../models/User');

const getAllCategoriesForOneCarRental = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const categories = await CarCategories.findAll({
            where: { car_rental_id: id }, include: [{ model: Categories }]
        });
        const carRental = await CarRental.findOne({ where: { id } });
        res.status(200).json({ categories, name: carRental.company_name });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getOneCategory = asyncHandler(async (req, res) => {
    try {
        const { category_id, car_rental_id } = req.params;
        const category = await CarCategories.findOne({
            where: { id: category_id, car_rental_id },
            include: [
                { model: Categories },
                { model: Booking, include: [{ model: User }] }
            ]
        });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const additionalInfoUpdate = asyncHandler(async (req, res) => {
    try {
        let { category_id, car_rental_id, seats, doors, transmission, km, unlimitedKm } = req.body;

        if (!category_id, !car_rental_id, !seats, !doors, !transmission, !km) {
            res.status(400);
            throw new Error('all fields required!');
        }
        if (unlimitedKm === true) {
            km = null;
        }

        const [numUpdated, updatedCategories] = await CarCategories.update(
            { seats, doors, transmission, km, unlimitedKm },
            { where: { car_rental_id, id: category_id } }
        );
        res.status(200).json({ numUpdated, updatedCategories, seats, doors, transmission, km, unlimitedKm });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const featuresUpdate = asyncHandler(async (req, res) => {
    try {
        const { category_id, car_rental_id, features } = req.body;

        const [numUpdated, updatedFeatures] = await CarCategories.update(
            { features },
            { where: { car_rental_id, id: category_id } }
        );
        res.status(200).json({ numUpdated, updatedFeatures, features });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const ratesUpdate = asyncHandler(async (req, res) => {
    try {
        const { category_id, car_rental_id, percent, final_rate, deposit_fee, same_rate } = req.body;

        if (((percent === '0' || !percent) && same_rate === false)) {
            res.status(400);
            throw new Error('all fields required!');
        }

        if (same_rate === true) {
            const [numUpdated, updatedCategories] = await CarCategories.update(
                { deposit_fee },
                { where: { car_rental_id, id: category_id } }
            );

            const rates = { deposit_fee };

            res.status(200).json({ numUpdated, updatedCategories, rates });
        } else {
            const [numUpdated, updatedCategories] = await CarCategories.update(
                { final_rate, percent, deposit_fee },
                { where: { car_rental_id, id: category_id } }
            );

            const rates = { final_rate, percent, deposit_fee };

            // const decreasings = await Decreasing.findAll({
            //     where: { car_categories_id: category_id }
            // })

            // if (decreasings) {
            //     for (const decreasing of decreasings) {
            //         decreasing.rate = final_rate - ((final_rate * decreasing.percent) / 100);
            //         await decreasing.save();
            //     }
            // }

            res.status(200).json({ numUpdated, updatedCategories, rates });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// const addDecreasing = asyncHandler(async (req, res) => {
//     try {
//         const { id, day, percent, final_rate } = req.body;

//         if (!day || !percent) {
//             res.status(400);
//             throw new Error('error');
//         }

//         const rate = final_rate - ((final_rate * percent) / 100);

//         const addedDecreasing = await Decreasing.create({
//             day,
//             rate,
//             percent,
//             old_rate: final_rate,
//             car_categories_id: id,
//         });

//         if (addedDecreasing) {
//             res.status(200).json(addedDecreasing);
//         } else {
//             res.status(400);
//             throw new Error('Decreasing not added!');
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// const deleteDecreasing = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.params; // get the ID from the URL parameter
//         const decreasing = await Decreasing.findOne({ where: { id } });
//         const deletedDecreasing = await Decreasing.destroy({
//             where: {
//                 id,
//             }
//         });

//         if (deletedDecreasing) {
//             res.status(200).json(decreasing);
//         } else {
//             res.status(400);
//             throw new Error('decreasing not deleted!');
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// const getDecreases = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.params;
//         const decreasing = await Decreasing.findAll({
//             where: { car_categories_id: id }
//         });
//         res.status(200).json(decreasing);
//     } catch (error) {
//         res.status(400);
//         throw error;
//     }
// });

const submitCategoriesSet = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const [numUpdated, updatedCategories] = await CarCategories.update(
            { verified: true },
            { where: { verified: false, car_rental_id: id } }
        );
        res.status(200).json({ numUpdated, updatedCategories });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = {
    getAllCategoriesForOneCarRental,
    featuresUpdate,
    additionalInfoUpdate,
    submitCategoriesSet,
    getOneCategory,
    // deleteDecreasing,
    // addDecreasing,
    // getDecreases,
    ratesUpdate
};