const asyncHandler = require('express-async-handler');
const axios = require('axios');
const CarRentals = require('../../../models/CarRentals');
const CarCategory = require('../../../models/Categories');
const Categories = require('../../../models/Categories');

const getDataFromApi = asyncHandler(async (req, res) => {
    try {
        const { data } = await axios.get('https://example.com/api/data');
        return data;
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const addCarApi2 = asyncHandler(async (req, res) => {
    const transaction = await sequelize.transaction(); // start transaction
    try {
        const id = 3;
        const data = {
            company_name: 'Auto Renting',
            manager_name: 'Abed',
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
                    weekday_rate: 1500,
                    weekend_rate: 1200,
                    seats: 2,
                    doors: 2,
                    transmission: "Double Shifts",
                    type: "Luxury",
                    cars: 2
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
                const matchingCategory = await CarCategory.findOne({ where: { categories_id: categoryRow.id, car_rental_id: id } });

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
                }, { transaction });
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

            // if (count) {
            await transaction.commit(); // commit transaction
            res.status(201).json({
                id,
                image: data.company_photo,
                name: data.company_name,
                count,
                notVerifiedCount
            });
            // } else {
            //     await transaction.rollback(); // rollback transaction
            //     res.status(201).json({ count });
            // }
        } else {
            res.status(400);
            throw new Error('No car rental signed up');
        }
    } catch (error) {
        await transaction.rollback(); // rollback transaction
        res.status(400).json({ message: error.message });
    }
});

module.exports = {
    addCarApi2
};
// const asyncHandler = require('express-async-handler');
// const axios = require('axios');
// const Car = require('../../../models/Cars');
// const CarRentals = require('../../../models/CarRentals');

// const getDataFromApi = asyncHandler(async (req, res) => {
//     try {
//         const { data } = await axios.get('https://example.com/api/data');
//         return data;
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// const addCarApi2 = asyncHandler(async (req, res) => {
//     try {
//         const id = 2;
//         // const data = await getDataFromApi();
//         const data = {
//             company_name: 'auto Renting',
//             manager_name: ' ahi',
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
//             email: '11931314@students.liu.edu.lb',
//             vat_number: '12322',
//             package: [
//                 {
//                     make: 'BMW',
//                     model: 'E92',
//                     year: 2022,
//                     seats: 3,
//                     doors: '2',
//                     transmission: 'manual',
//                     bags: 3,
//                     currency: 'usd',
//                     deposit_fee: '120.00',
//                     deposit_currency: 'usd',
//                     active: true,
//                     color_name: 'black',
//                     plate_number: 886190,
//                     vin_number: '12322',
//                     engine_number: '1231231d',
//                     photos: [
//                         {
//                             image:
//                                 'https://images.pexels.com/photos/7744382/pexels-photo-7744382.jpeg?auto=compress&cs=tinysrgb&w=1600',
//                         },
//                         {
//                             image:
//                                 'https://images.pexels.com/photos/9717205/pexels-photo-9717205.jpeg?auto=compress&cs=tinysrgb&w=1600',
//                         },
//                     ],
//                     damage_points: {
//                         points: '1',
//                     },
//                     createdAt: '2023-04-13T00:27:53.000Z',
//                     updatedAt: '2023-04-13T00:27:53.000Z',
//                     category: 'SUV'
//                 },
//                 {
//                     make: 'range',
//                     model: 'sport',
//                     year: 2023,
//                     seats: 3,
//                     doors: '2',
//                     transmission: 'double shift',
//                     bags: 3,
//                     currency: 'usd',
//                     deposit_fee: '120.00',
//                     deposit_currency: 'usd',
//                     active: true,
//                     color_name: 'black',
//                     plate_number: 886090,
//                     vin_number: '123220',
//                     engine_number: '12301231d',
//                     photos: [
//                         {
//                             image:
//                                 'https://images.pexels.com/photos/7744382/pexels-photo-7744382.jpeg?auto=compress&cs=tinysrgb&w=1600',
//                         },
//                         {
//                             image:
//                                 'https://images.pexels.com/photos/9717205/pexels-photo-9717205.jpeg?auto=compress&cs=tinysrgb&w=1600',
//                         },
//                     ],
//                     damage_points: {
//                         points: '1',
//                     },
//                     createdAt: '2023-04-13T00:27:53.000Z',
//                     updatedAt: '2023-04-13T00:27:53.000Z',
//                     category: 'SUV'
//                 },
//                 {
//                     make: 'kia',
//                     model: 'sport',
//                     year: 2023,
//                     seats: 3,
//                     doors: '2',
//                     transmission: 'double shift',
//                     bags: 3,
//                     currency: 'usd',
//                     deposit_fee: '120.00',
//                     deposit_currency: 'usd',
//                     active: true,
//                     color_name: 'black',
//                     plate_number: 18309,
//                     vin_number: 'asdda33123',
//                     engine_number: '12321231sad',
//                     photos: [
//                         {
//                             image:
//                                 'https://images.pexels.com/photos/7744382/pexels-photo-7744382.jpeg?auto=compress&cs=tinysrgb&w=1600',
//                         },
//                         {
//                             image:
//                                 'https://images.pexels.com/photos/9717205/pexels-photo-9717205.jpeg?auto=compress&cs=tinysrgb&w=1600',
//                         },
//                     ],
//                     damage_points: {
//                         points: '1',
//                     },
//                     createdAt: '2023-04-13T00:27:53.000Z',
//                     updatedAt: '2023-04-13T00:27:53.000Z',
//                     category: 'SUV'
//                 },
//                 {
//                     make: 'toyota',
//                     model: 'sport',
//                     year: 2023,
//                     seats: 3,
//                     doors: '2',
//                     transmission: 'double shift',
//                     bags: 3,
//                     currency: 'usd',
//                     deposit_fee: '120.00',
//                     deposit_currency: 'usd',
//                     active: true,
//                     color_name: 'black',
//                     plate_number: 183029,
//                     vin_number: 'asdda3ss3123',
//                     engine_number: '12321aasd231sad',
//                     photos: [
//                         {
//                             image:
//                                 'https://images.pexels.com/photos/7744382/pexels-photo-7744382.jpeg?auto=compress&cs=tinysrgb&w=1600',
//                         },
//                         {
//                             image:
//                                 'https://images.pexels.com/photos/9717205/pexels-photo-9717205.jpeg?auto=compress&cs=tinysrgb&w=1600',
//                         },
//                     ],
//                     damage_points: {
//                         points: '1',
//                     },
//                     createdAt: '2023-04-13T00:27:53.000Z',
//                     updatedAt: '2023-04-13T00:27:53.000Z',
//                     category: 'SUV'
//                 },
//             ],
//         }

//         const carRentalExist = await CarRentals.findOne({ where: { email: data.email } });
//         if (carRentalExist) {
//             const existingCars = await Car.findAll();

//             const newCars = [];
//             for (const car of data.package) {
//                 const exists = existingCars.some((c) =>
//                     c.engine_number === car.engine_number || c.plate_number === car.plate_number || c.vin_number === car.vin_number
//                 );
//                 if (!exists) {
//                     newCars.push(car);
//                 }
//             }

//             for (const car of newCars) {
//                 await Car.create({
//                     make: car.make,
//                     model: car.model,
//                     year: car.year,
//                     seats: car.seats,
//                     doors: car.doors,
//                     transmission: car.transmission,
//                     bags: car.bags,
//                     currency: car.currency,
//                     deposit_fee: car.deposit_fee,
//                     deposit_currency: car.deposit_currency,
//                     active: car.active,
//                     color_name: car.color_name,
//                     plate_number: car.plate_number,
//                     vin_number: car.vin_number,
//                     engine_number: car.engine_number,
//                     damage_points: car.damage_points,
//                     photos: car.photos,
//                     car_rental_id: id,
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                     car_categories_id: 1
//                 });
//             }

//             const count = await Car.count({
//                 where: { car_rental_id: 2, verified1: false, verified2: false }
//             });

//             if (count) {
//                 res.status(201).json({ id: 2, image: carRentalExist.company_photo, name: carRentalExist.company_name, count });
//             } else {
//                 res.status(201).json({ count });
//             }
//         } else {
//             res.status(400);
//             throw new Error('No car rental signed uo');
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// module.exports = {
//     addCarApi2
// };