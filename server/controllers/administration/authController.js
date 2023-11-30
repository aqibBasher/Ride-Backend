const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Administration = require('../../models/Administration');
const Otp = require('../../models/Otp');
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');
const cuid = require('cuid');

// Login Verify
const verifyOtp = asyncHandler(async (req, res) => {
    try {
        const { code } = req.body;

        // If no code passed
        if (!code) {
            res.status(400);
            throw new Error('Must provide code!');
        }

        // Checking if the code exist in the otp table (database)
        let userCodeExists = null;
        try {
            userCodeExists = await Otp.findOne({ where: { code } });
        } catch (error) {
            res.status(500);
            throw new Error('Network Error');
        }

        if (userCodeExists) { // True
            const user = await Administration.findOne({ where: { email: userCodeExists.email } });

            if (user) {
                await Otp.destroy({ where: { email: userCodeExists.email } });

                res.status(200).json({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                    accessToken: generateToken({ id: user.id })
                });
            } else {
                res.status(400);
                throw new Error('Your OTP was wrong!');
            }
        } else {
            res.status(400);
            throw new Error('Your OTP was wrong!');
        }
    } catch (error) {
        res.status(400);
        throw error;
    }
});

// Sign up new account 
const signup = asyncHandler(async (req, res) => {
    if (req.user.role === 'admin') {
        try {
            const { first_name, last_name, role, email, confirm_email, password, confirm_password } = req.body;

            if (!first_name || !last_name || role === 'default' || !email || !confirm_email || !password || !confirm_password) {
                res.status(400);
                throw new Error('Please add all fields!');
            }

            // Check if user exists
            let userExists = null;
            try {
                userExists = await Administration.findOne({ where: { email } });
            } catch (error) {
                res.status(500);
                throw new Error('Network Error');
            }

            if (userExists) {
                res.status(400);
                throw new Error('Email already exists');
            }

            if (email !== confirm_email) {
                res.status(400);
                throw new Error('Email and email confirmation not matched');
            }

            if (password !== confirm_password) {
                res.status(400);
                throw new Error('Password and password confirmation not matched');
            }

            // Hash Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const genId = cuid();
            const modifiedId = genId.substring(genId.length - 10);

            const user = await Administration.create({
                id: modifiedId,
                password: hashedPassword,
                first_name,
                last_name,
                email,
                role
            });

            if (user) {
                res.status(200).json({
                    message: `${email} created successfully as a ${role}`
                });
            } else {
                res.status(400);
                throw new Error('Invalid Credentials');
            }
        } catch (error) {
            res.status(400);
            throw error;
        }
    } else {
        res.status(400);
        throw new Error("You don't have permission!");
    }
});

const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please add all fields!');
        }

        let user = null;
        try {
            user = await Administration.findOne({ where: { email } });
        } catch (error) {
            res.status(500);
            throw new Error('Network Error');
        }

        // Check if user exists and password matched && (await bcrypt.compare(password, user.password))
        if (user) {
            const userHasCode = await Otp.findOne({ where: { email } });

            try {
                // Delete old row code
                if (userHasCode) await userHasCode.destroy();
                const otp = await Otp.create({
                    email: email,
                    code: generateOTP() // Code generator function
                });

                // Sent email to the logging in account
                // await sendOTPEmail(email, otp.code);

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

const me = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

const resend = asyncHandler(async (req, res) => {
    try {
        const { email } = req.params;

        const admin = await Administration.findOne({ where: { email } });

        if (admin) {
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

// Generate JWT
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
}

module.exports = {
    verifyOtp,
    signup,
    resend,
    login,
    me
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
            text: `${otp} is your verification code for XRide Login.`,
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