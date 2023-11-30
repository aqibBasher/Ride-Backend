const asyncHandler = require('express-async-handler');
const Booking = require('../../models/Bookings');
const Reviews = require('../../models/Reviews');
const CarRental = require('../../models/CarRentals');
const User = require('../../models/User');
const Car = require('../../models/Cars');
const SupportContacts = require('../../models/SupportContacts');
const Category = require('../../models/Categories');
// const Categories = require('../../models/Categories');
// const CategoryPhotos = require('../../models/CategoryPhotos');
const cuid = require('cuid');
const Rooms = require('../../models/Rooms');
const { Op } = require('sequelize');

const getAllBookings = asyncHandler(async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        include: [
          { model: User },
          { model: Category },
          {
            model: Car,
            where: { car_rental_id: req.user.id },
            include: [
              {
                model: CarRental,
                where: { id: req.user.id },
              },
            ],
          },
        ],
        where: {
          booking_status: {
            [Op.ne]: 3, // Use Op.ne to find bookings where booking_status is not equal to 3
          },
        },
      });
      res.status(200).json(bookings);
    } catch (error) {
      res.status(400);
      throw error;
    }
  });
  


const getAllBookingsHistory = asyncHandler(async (req, res) => {
    try {
        const bookings = await Booking.findAll({
   
            include: [
                { model: User },
                { model: Category, },
                {
                    model: Car,
                    where: { car_rental_id: req.user.id },
                    include: [{
                        model: CarRental,
                        where: { id: req.user.id },
                    }]
                }
            ],
            where: { booking_status: 3 },
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

//Booking Statuses
// -1 : canceled
// 0 : placed
// 1 : created agreement 
// 2 : active
// 3 : finished  

const getOneBooking = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findOne({
            // where: { id,  $or:[{booking_status:0},{booking_status:1},{booking_status:2}]},
            where: { id,  booking_status: {
                [Op.in]: [0, 1, 2, 3]
              }},
            include: [
                { model: User },
                // { model: Rooms },
                { model: Category},
                {
                    model: Car,
                    where: { car_rental_id: req.user.id },
                    include: [{
                        model: CarRental,
                        where: { id: req.user.id },
                    }]
                }
            ]
        });
        res.status(200).json(booking);
    } catch (error) {
        console
        console.log(error)
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
                { model: Rooms },
                {
                    model: Car,
                    where: { car_rental_id: req.user.id },
                    include: [{
                        model: CarRental,
                        where: { id: req.user.id }
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
            { new_company: false },
            { where: { id, new_company: true } }
        );
        res.status(200).json({ message: `${result[0]} bookings updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const finishBooking = asyncHandler(async (req, res) => {
    console.log("req.body",req.body)
    const { description, placed_date, booking_id, user_id, rating, car_rental_id } = req.body;
    const id = booking_id;
    try {
        await Booking.update(
            { booking_status: 3 },
            { where: { id } }
        );

        await Reviews.create({
            description: description,
            rating: rating,
            placed_date: placed_date,
            user_id: user_id,
            booking_id: booking_id,
            car_rental_id: car_rental_id
            // other fields you want to set
          });
        res.status(200).json({ message: `Review Added.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getSupportContactBookings = asyncHandler(async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: Car, where: { car_rental_id: req.user.id } },
                { model: User }
            ]
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const addSupportContact = asyncHandler(async (req, res) => {
    try {
        const { description, label, bookingID, userID, other } = req.body;
        if (!description || !label) {
            res.status(400);
            throw new Error('add all fields!');
        }
        const genId = cuid();
        const modifiedId = genId.substring(genId.length - 10);
        const support = await SupportContacts.create({
            id: modifiedId,
            description,
            label,
            booking_id: bookingID === '0' ? null : bookingID,
            user_id: userID,
            submited_date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            car_rental_id: req.user.id,
            other
        });

        if (support) {
            res.status(201).json({ message: 'Support Contact Created Successfully!' });
        } else {
            res.status(400);
            throw new Error('Support Contact did not created!');
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    };
});

module.exports = {
    getSupportContactBookings,
    addSupportContact,
    updateNewState,
    finishBooking,
    getAllBookingsHistory,
    getAllBookings,
    getOneBooking,
    getBooking,
};