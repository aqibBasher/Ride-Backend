const asyncHandler = require('express-async-handler');
const User = require('../../../models/User');
const Otp = require('../../../models/Otp');
const TermsVersion = require('../../../models/TermsVersion');
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');
const cuid = require('cuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 

const emailLogin = asyncHandler(async (req, res) => {
    try {
        const { email,password } = req.body;

        if (!email) {
            res.status(400);
            throw new Error('Please enter your email address!');
        }

        const user = await User.findOne({ where: { email } });

        if (user) {
            if (user.logged_in && user.logged_in) {
                // User is already logged in
                res.status(400);
                throw new Error('User is already logged in');
            }

            if(user.logged_in_date && user.logged_in_date.length>0){
                if(hasDayPassed(user.logged_in_date)){
                    res.status(400);
                    throw new Error('Otp is required');
                }
            }
            else{
                res.status(400);
                throw new Error('Otp is required');
            }

            const matchingPasswords = await bcrypt.compare(password, user.password);
            // Check if user exists and password matched && (await bcrypt.compare(password, user.password))
           if(user.type && user.type === 0){
            if (user && matchingPasswords) {
                
                res.status(200).json({
                     id:user.id,
                     email,
                     hasDayPassed:hasDayPassed(user.logged_in_date),
                     accessToken:generateToken({ id: user.id })
                    });
            
                    await user.update({logged_in_date: new Date()})
                    await user.update({logged_in: true})
        }
           }
           else{
            res.status(400);
            throw new Error('Email is associated with google');
           }
        
        } else {
            // User credentials are invalid
            res.status(400);
            throw new Error('Invalid Credentials');
        }
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const googleLogin = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400);
            throw new Error('Please enter your email address!');
        }

        const user = await User.findOne({ where: { email } });

        if (user) {
            if (user.logged_in) {
                // User is already logged in
                res.status(400);
                throw new Error('User is already logged in');

            }
    

            if(user.type && user.type === 1){
                if(hasDayPassed(user.logged_in_date)){
                    res.status(400);
                    throw new Error('Otp is required');
                }
                else{
                    res.status(200).json({
                        id:user.id,
                        email,
                        hasDayPassed:hasDayPassed(user.logged_in_date),
                        accessToken:generateToken({ id: user.id })
                       });
                    await user.update({logged_in_date: new Date()})
                    await user.update({logged_in: true})
                }
            
            }
            else{
                throw new Error('Email not associated with google');
            }
            

        } else {
            // User credentials are invalid
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
            const user = await User.findOne({ where: { email: userCodeExists.email } });

            if (user) {
                if (user.logged_in) {
                    await t.rollback();
                    res.status(400);
                    throw new Error('User is already logged in!');
                }

                await Otp.destroy({ where: { email: userCodeExists.email }, transaction: t });

                user.logged_in = true;
                await user.save({ transaction: t });

                await t.commit();

                res.status(200).json({
                    id: user.id,
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

        const user = await User.findOne({ where: { email } });

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
        const user = await User.findOne({ where: { id, logged_in: true } });

        if (!user) {
            res.status(400);
            throw new Error('User already logged out!');
        }

        user.logged_in = false;
        await user.save();

        res.status(200).json({ message: 'User logged out!' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const signup = asyncHandler(async (req, res) => {
    try {
        const { email, type,first_name, last_name, password, version ,timestamp} = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            res.status(400);
            throw new Error('Email already exists');
        }
        if (password.length < 6) {
            res.status(400);
            throw new Error('At least 7 char!');
        }

            // Hash Password
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(password, salt);
   
           const genId = cuid();
           const modifiedId = genId.substring(genId.length - 10);

            try {
               const user = await User.create({
                id:modifiedId,
                password:hashedPassword,
                email,
                type,
                first_name,
                last_name,
                version,
                createdAt: timestamp,
                updatedAt: timestamp,
                driving_license_doc :'null'
         });
                res.status(200).json({id: user.id });
            } catch (error) {
                res.status(400);
                throw new Error('Something went wrong.');
            } 
        } catch (error) {
        res.status(400);
        throw error;
    }
});

const getUser = asyncHandler(async (req,res)=>{

    const { id } = req.params

    try{
        const user = await User.findOne({where:{id}})
        res.status(200).json(user)
    }
    catch (error){
        res.status(400)
        throw error;
    }

})
const getTermsVersion = asyncHandler(async (req,res)=>{

    try{
        const terms = await TermsVersion.findAll()
        res.status(200).json(terms[terms.length-1].version)
    }
    catch (error){
        res.status(400)
        throw error
    }

})


module.exports = {
    verifyOtp,
    resend,
    emailLogin,
    googleLogin,
    logout,
    signup,
    getUser,
    getTermsVersion,
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
        length: 4,
        charset: 'numeric'
    });
}

// Generate JWT
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
}

function hasDayPassed(currentDayFromDb) {
    if (!currentDayFromDb || !(currentDayFromDb instanceof Date)) {
        return false; // Handle the case where current day is not valid
    }

    const currentDate = new Date(); // Get the current date and time
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const dbYear = currentDayFromDb.getFullYear();
    const dbMonth = currentDayFromDb.getMonth();
    const dbDay = currentDayFromDb.getDate();

    // Compare the year, month, and day components
    return (
        dbYear < currentYear ||
        (dbYear === currentYear && dbMonth < currentMonth) ||
        (dbYear === currentYear && dbMonth === currentMonth && dbDay < currentDay)
    );
}
