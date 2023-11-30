const asyncHandler = require('express-async-handler');
const axios = require('axios');
const CarRentals = require('../../../models/CarRentals');
const CarCategory = require('../../../models/Categories');
const Categories = require('../../../models/Categories');
const cuid = require('cuid');

const addCarApi1 = asyncHandler(async (req, res) => {
    const transaction = await sequelize.transaction(); // start transaction
    try {
        const id = 'cjld2cjxh0000qzrmn831i7rn';
        const data = {
            company_name: 'Abed Classic',
            manager_name: 'ahi',
            manager_phone_number: '+961 70 000 212',
            insurance_doc:
                'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
            company_photo:
                'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
            signature:
                'https://images.pexels.com/photos/9075150/pexels-photo-9075150.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
            stamp:
                'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
            second_page_agreement:
                'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
            api_url:
                'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
            api_username: 'username',
            api_password: 'password',
            api_key:
                'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
            website_url:
                'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
            email: 'abed_ashi@hotmail.com',
            vat_number: '12322',
            package: [
                {
                    weekday_rate: 100,
                    weekend_rate: 120,
                    seats: 4,
                    doors: 4,
                    transmission: "manual",
                    cars: 20,
                    type: "SUV"
                },
                {
                    weekday_rate: 100,
                    weekend_rate: 120,
                    seats: 4,
                    doors: 4,
                    transmission: "auto",
                    cars: 11,
                    firstCar: "Kia",
                    type: "Coupe"
                },
                {
                    weekday_rate: 100,
                    weekend_rate: 120,
                    seats: 4,
                    doors: 4,
                    transmission: "double shifts",
                    cars: 1,
                    firstCar: "Lambo",
                    type: "Luxury"
                },
            ],
        };

        const carRentalExist = await CarRentals.findOne({ where: { id } });
        if (carRentalExist) {
            // const existingCategories = await CarCategory.findAll({ where: { car_rental_id: id } });

            const categories = [];
            const updates = [];

            for (const category of data.package) {
                // Check if category already exists in database
                const type = category.type;
                const categoryRow = await Categories.findOne({ where: { type } });
                const matchingCategory = await CarCategory.findOne({ where: { categories_id: categoryRow.id } });
                console.log(categoryRow.id);

                if (matchingCategory) {
                    // Category already exists, add it to updates array
                    updates.push(matchingCategory);
                } else {
                    categories.push(category);
                }
            }

            for (const category of categories) {
                const type = await Categories.findOne({ where: { type: category.type }, transaction });

                const genId = cuid();
                const modifiedId = genId.substring(genId.length - 10);
                await CarCategory.create({
                    id: modifiedId,
                    original_rate: category.weekday_rate,
                    seats: category.seats,
                    doors: category.doors,
                    transmission: category.transmission,
                    categories_id: type.id,
                    car_rental_id: id,
                    cars: category.cars,
                    final_rate: null,
                    percent: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, { transaction }); // pass transaction to create method
            }

            console.log('updates:', updates);
            console.log('categories', categories);

            const count = await CarCategory.count({
                where: { car_rental_id: id },
                transaction
            });

            const notVerifiedCount = await CarCategory.count({
                where: { car_rental_id: id, verified: false },
                transaction
            });

            await transaction.commit(); // commit transaction
            res.status(201).json({
                id,
                image: data.company_photo,
                name: data.company_name,
                count, notVerifiedCount
            });
        } else {
            res.status(400);
            // throw new Error('No car rental signed up');
            throw error;
        }
    } catch (error) {
        console.log(error);
        await transaction.rollback(); // rollback transaction
        res.status(400).json({ message: error.message });
    }
});

module.exports = {
    addCarApi1
};


// const asyncHandler = require('express-async-handler');
// const axios = require('axios');
// const CarRentals = require('../../../models/CarRentals');
// const CarCategory = require('../../../models/CarCategories');
// const Categories = require('../../../models/Categories');

// const getDataFromApi = asyncHandler(async (req, res) => {
//     try {
//         const { data } = await axios.get('https://example.com/api/data');
//         return data;
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// const addCarApi1 = asyncHandler(async (req, res) => {
//     try {
//         const id = 1;
//         const data = {
//             company_name: 'Xride Renting',
//             manager_name: 'ahi',
//             manager_phone_number: '+961 70 000 212',
//             insurance_doc:
//                 'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
//             company_photo:
//                 'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
//             signature:
//                 'https://images.pexels.com/photos/9075150/pexels-photo-9075150.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
//             stamp:
//                 'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
//             second_page_agreement:
//                 'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
//             api_url:
//                 'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
//             api_username: 'username',
//             api_password: 'password',
//             api_key:
//                 'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
//             website_url:
//                 'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
//             email: 'abed_ashi@hotmail.com',
//             vat_number: '12322',
//             package: [
//                 {
//                     weekday_rate: 100,
//                     weekend_rate: 120,
//                     seats: 4,
//                     doors: 4,
//                     transmission: "manual",
//                     type: "SUV"
//                 },
//                 {
//                     weekday_rate: 100,
//                     weekend_rate: 120,
//                     seats: 4,
//                     doors: 4,
//                     transmission: "auto",
//                     cars: 11,
//                     firstCar: "Kia",
//                     type: "Coupe"
//                 },
//                 {
//                     weekday_rate: 100,
//                     weekend_rate: 120,
//                     seats: 4,
//                     doors: 4,
//                     transmission: "double shifts",
//                     cars: 11,
//                     firstCar: "Lambo",
//                     type: "Luxury"
//                 },
//             ],
//         };

//         const carRentalExist = await CarRentals.findOne({ where: { id } });
//         if (carRentalExist) {
//             // const existingCategories = await CarCategory.findAll({ where: { car_rental_id: id } });

//             const categories = [];
//             const updates = [];

//             for (const category of data.package) {
//                 // Check if category already exists in database
//                 const type = category.type;
//                 const categoryRow = await Categories.findOne({ where: { type } });
//                 const matchingCategory = await CarCategory.findOne({ where: { categories_id: categoryRow.id } });

//                 if (matchingCategory) {
//                     // Category already exists, add it to updates array
//                     updates.push(matchingCategory);
//                 } else {
//                     categories.push(category);
//                 }
//             }

//             for (const category of categories) {
//                 const type = await Categories.findOne({ where: { type: category.type } });
//                 await CarCategory.create({
//                     weekday_rate: category.weekday_rate,
//                     weekend_rate: category.weekend_rate,
//                     seats: category.seats,
//                     doors: category.doors,
//                     transmission: category.transmission,
//                     categories_id: type.id,
//                     car_rental_id: id,
//                     createdAt: new Date(),
//                     updatedAt: new Date()
//                 });
//             }
//             console.log('updates:', updates);
//             console.log('categories', categories);

//             const count = await CarCategory.count({
//                 where: { car_rental_id: id }
//             });

//             if (count) {
//                 res.status(201).json({ id, image: data.company_photo, name: data.company_name, count });
//             } else {
//                 res.status(201).json({ count });
//             }
//         } else {
//             res.status(400);
//             throw new Error('No car rental signed up');
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// module.exports = {
//     addCarApi1
// };