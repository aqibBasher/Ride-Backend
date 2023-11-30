const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const CarRental = require('../../../models/CarRentals');
const Otp = require('../../../models/Otp');
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');

const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please add all fields!');
        }

        let carRental = null;
        try {
            carRental = await CarRental.findOne({ where: { email } });
        } catch (error) {
            res.status(500);
            throw new Error('Network Error');
        }

        // Check if carRental exists and password matched && (await bcrypt.compare(password, carRental.password))
        if (carRental) {
            if (carRental.logged_in) {
                // User is already logged in
                res.status(400);
                throw new Error('Car Rental is already logged in');
            }

            const userHasCode = await Otp.findOne({ where: { email } });

            try {
                // Delete old row code
                if (userHasCode) await userHasCode.destroy();
                const otp = await Otp.create({
                    email: email,
                    code: generateOTP() // Code generator function
                });

                // Sent email to the logging in account
                await sendOTPEmail(email, otp.code);

                res.status(200).json({ email });
            } catch (error) {
                await userHasCode.destroy();
                res.status(400);
                throw new Error('Something went wrong, please re-login again!');
            }
        } else {
            res.status(400);
            throw new Error('Invalid Credentials');
        }
    } catch (error) {
        res.status(400);
        throw error;
    }
});

// Login Verify
const verifyOtp = asyncHandler(async (req, res) => {
    let t;

    try {
        const { code } = req.body;

        if (!code) {
            res.status(400);
            throw new Error('Must provide code!');
        }

        let userCodeExists = null;
        try {
            t = await sequelize.transaction();
            userCodeExists = await Otp.findOne({ where: { code }, transaction: t });
        } catch (error) {
            if (t) {
                await t.rollback();
            }
            res.status(500);
            throw new Error('Network Error');
        }

        if (userCodeExists) {
            const carRental = await CarRental.findOne({ where: { email: userCodeExists.email } });

            if (carRental) {
                if (carRental.logged_in) {
                    await t.rollback();
                    res.status(400);
                    throw new Error('Car Rerntal is already logged in!');
                }

                await Otp.destroy({ where: { email: userCodeExists.email }, transaction: t });

                carRental.logged_in = true;
                await carRental.save({ transaction: t });

                await t.commit();

                res.status(200).json({
                    id: carRental.id,
                    email: carRental.email,
                    company_name: carRental.company_name,
                    manager_name: carRental.manager_name,
                    manager_phone_number: carRental.manager_phone_number,
                    insurance_doc: carRental.insurance_doc,
                    company_photo: carRental.company_photo,
                    signature: carRental.signature,
                    stamp: carRental.stamp,
                    second_page_agreement: carRental.second_page_agreement,
                    api_url: carRental.api_url,
                    api_username: carRental.api_username,
                    api_password: carRental.api_password,
                    website_url: carRental.website_url,
                    vat_number: carRental.vat_number,
                    verified: carRental.verified,
                    createdAt: carRental.createdAt,
                });
            } else {
                await t.rollback();
                res.status(400);
                throw new Error('Your OTP was wrong!');
            }
        } else {
            await t.rollback();
            res.status(400);
            throw new Error('Your OTP was wrong!');
        }
    } catch (error) {
        if (t && t.finished !== 'rollback' && t.finished !== 'commit') {
            await t.rollback();
        }
        res.status(400);
        throw error;
    }
});

const resend = asyncHandler(async (req, res) => {
    try {
        const { email } = req.params;

        const carRental = await CarRental.findOne({ where: { email } });

        if (carRental) {
            const userHasCode = await Otp.findOne({ where: { email } });

            try {
                // Delete old row code
                if (userHasCode) await userHasCode.destroy();
                const otp = await Otp.create({
                    email: email,
                    code: generateOTP() // Code generator function
                });

                // Sent email to the logging in account
                await sendOTPEmail(email, otp.code);

                res.status(200).json({ email });
            } catch (error) {
                await userHasCode.destroy();
                res.status(400);
                throw new Error('Something went wrong, please re-login again!');
            }
        } else {
            res.status(400);
            throw new Error('Wrong Email!');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const logout = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const carRental = await CarRental.findOne({ where: { id, logged_in: true } });

        if (!carRental) {
            res.status(400);
            throw new Error('Car Rental already logged out!');
        }

        carRental.logged_in = false;
        await carRental.save();

        res.status(200).json({ message: 'Car Rental logged out!' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = {
    verifyOtp,
    resend,
    login,
    logout
};

function sendOTPEmail(email, otp) {
    return new Promise((resolve, reject) => {
        // create a nodemailer transporter using transport
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            port: 587,
            auth: {
                user: process.env.EMAIL_ADDRESSS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // define email options
        const mailOptions = {
            from: process.env.EMAIL_ADDRESSS,
            to: email,
            subject: 'Your OTP for verification',
            text: `${otp} is your verification code for XRide Business Login.`,
        };

        // send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log(`Email sent: ${info.response}`);
                resolve();
            }
        });
    });
}



function generateOTP() {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}