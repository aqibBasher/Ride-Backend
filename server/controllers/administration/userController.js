const asyncHandler = require('express-async-handler');
const User = require('../../models/User');
const Booking = require('../../models/Bookings');
const CarRental = require('../../models/CarRentals');
const Car = require('../../models/Cars');

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const getOneUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id },
            include: [
                {
                    model: Booking,
                    include: [{
                        model: Car,
                        include: [{
                            model: CarRental,
                        }]
                    }]
                }]
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const verifyUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.update(
            { verified: true },
            { where: { id } }
        )
        res.status(200).json({ message: `${user[0]} User  updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

// const verifyUserByAdmin = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.update(
//             { verified2: true },
//             { where: { id } }
//         )
//         res.status(200).json({ message: `${user[0]} User  updated.` });
//     } catch (error) {
//         res.status(400);
//         throw error;
//     }
// });

const editUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const {
            first_name,
            last_name,
            date_of_birth,
            profile_photo,
            phone_number,
            country_code,
            permenant_address,
            driving_license_doc,
            passport_doc,
            id_doc,
            nationality,
            father_name,
            mother_name,
            driving_license_number,
            passport_number,
            id_number,
            passport_issued_date,
            passport_expiry_date,
        } = req.body

        if (
            !first_name ||
            !last_name ||
            !date_of_birth ||
            !profile_photo ||
            !phone_number ||
            !country_code ||
            !permenant_address ||
            !driving_license_doc ||
            !passport_doc ||
            !id_doc ||
            !nationality ||
            !father_name ||
            !mother_name ||
            !driving_license_number ||
            !passport_number ||
            !id_number ||
            !passport_issued_date ||
            !passport_expiry_date
        ) {
            res.status(400);
            throw new Error('Please add all fields!');
        }

        const user = await User.update(
            {
                first_name, last_name, date_of_birth,
                profile_photo, phone_number, country_code,
                permenant_address, driving_license_doc,
                passport_doc, id_doc, nationality,
                father_name, mother_name, driving_license_number,
                passport_number, id_number, passport_issued_date,
                passport_expiry_date,
            },
            { where: { id } }
        );
        res.status(200).json({ message: `${user[0]} user updated.` });

    } catch (error) {
        res.status(400);
        throw error;
    }
});

const updateNewState = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.update(
            { new: false },
            { where: { id } }
        );
        res.status(200).json({ message: `${result[0]} user updated.` });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    updateNewState,
    getAllUsers,
    getOneUser,
    verifyUser,
    editUser
};