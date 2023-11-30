const asyncHandler = require('express-async-handler');
const { Storage } = require('@google-cloud/storage');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CarRental = require('../../models/CarRentals');
const Otp = require('../../models/Otp');
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');
// const Branch = require('../../models/Branches');
const Car = require('../../models/Cars');
const Booking = require('../../models/Bookings');
// const Category = require('../../models/CarCategories');
// const Branches = require('../../models/Branches');
const path = require('path');
const cuid = require('cuid');
const Token = require('../../models/Token');
const Branches = require('../../models/Branches');

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
            const user = await CarRental.findOne({ where: { email: userCodeExists.email } });

            if (user) {
              await user.update({logged_in_date: new Date()})
                await Otp.destroy({ where: { email: userCodeExists.email } });

               if (user.verified){
              
                res.status(200).json({
                    id: user.id,
                    email: user.email,
                    company_name: user.company_name,
                    landline_number: user.landline_number,
                    api_docs_url: user.api_docs_url,
                    api_key: user.api_key,
                    branches: user.branches,
                    delivery_options: user.delivery_options,
                    company_logo: user.company_logo,
                    stamp: user.stamp,
                    vat_number: user.vat_number,
                    verified: user.verified,
                    createdAt: user.createdAt,
                    accessToken: generateToken({ id: user.id })
                });
               }
               else{
                res.status(200).json({
                    id:user.id,
                    email:user.email,
                    company_name:user.company_name,
                    verified: user.verified,
                    createdAt: user.createdAt,
                    accessToken: generateToken({ id: user.id })
                })
               }
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

const storage = new Storage({
    keyFilename: path.join(__dirname, '../../../xride-key.json')
});

const uploadImage = (picture,isLogo,isStamp,name)=>{
    const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; 
    let fileName;
    if(isLogo){

         fileName = 'carRentals/logos/' + name.company_name + '_' + name.id + '.' + picture.type.split('/')[1];
    }
    else if(isStamp){
      fileName = 'carRentals/stamps/' + name.company_name + '_' +  name.id+ '.png';
    }
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const buffer = Buffer.from(picture.uri.replace(/^data:image\/\w+;base64,/, ''), 'base64');

       // Upload the file to the bucket    
    const stream = file.createWriteStream({
        metadata: {
          contentType: picture.type,
        },
      });
      
      stream.on('error', (err) => {
        console.error(err);
      });
      
      stream.on('finish', () => {
        console.log(`Image uploaded to ${fileName}.`);
      });
      
      stream.end(buffer);
    // Get the public URL for the file
    // const url = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    const url = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return url
}
// Sign up new account
const signup = asyncHandler(async (req, res, next) => {
    const { email, password, company_name} = req.body;
    const transaction = await sequelize.transaction();
    try {
        
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const genId = cuid();
        const modifiedId = genId.substring(genId.length - 10);

       const carRental =  await CarRental.create({
            id: modifiedId,
            email,
            password: hashedPassword,
            company_name,
            vat_number:'n/a',
            landline_number:'n/a',
            api_docs_url:'n/a',
            api_key:'n/a',
            delivery_options:'n/a',
            company_logo:'n/a', // Store the public URL in the database
            stamp :'n/a',
            joined_date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        });
    
        await transaction.commit();
        res.status(201).json({...carRental.dataValues, accessToken: generateToken({ id: carRental.id })});
    } catch (error) {
        if (transaction.finished) {
            console.log('Transaction already finished');
        } else {
            await transaction.rollback();
        }
        res.status(400).json({ message: error.message });
    }
});

const completeSignup = asyncHandler(async (req, res, next) => {
    const {landline_number, vat_number, pictures,api_docs_url,api_key,location,address,open_days,open_time,close_time,delivery_options} = req.body;
    
    const company_pictures = JSON.parse(pictures)
   
    const transaction = await sequelize.transaction();
    try {
    
        const name = {id:req.user.id,company_name:req.user.company_name}
        const company_logo = uploadImage(company_pictures[0],true,false,name)
        const stamp = uploadImage(company_pictures[1],false,true,name)

        const genId = cuid();
        const modifiedId = genId.substring(genId.length - 10);

        const newBranch = await Branches.create({
            id:modifiedId,
            car_rental_id: req.user.id, // Set the car_rental_id
            location:JSON.parse(location),
            address,
            open_days: JSON.parse(open_days),
            open_time,
            close_time,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

        const carRental = await CarRental.update({
            vat_number,
            landline_number,
            api_docs_url,
            api_key,
            delivery_options,
            company_logo, // Store the public URL in the database
            stamp,
            updatedAt: new Date(), // Updated the updatedAt field
            branches: [ // Update the associated Branches
             newBranch,
            ],
          }, {
            where: { id: req.user.id },
            include: [Branches], // Include the associated Branches for updating
            returning: true, // To get the updated record as a result
          });

    
        if(carRental){
            console.log('User succesfully completed signed up')
            
           const token = await Token.create({
                user_id:req.user.id,
                token: jwt.sign({payload:new Date().getTime()},process.env.JWT_SECRET,{ expiresIn: 60 * 10 }) 
            })     
            console.log('Token Succesfully generated')
            const link = `https://admin.xrideapp.com/api/v1/car-rental/auth/login/verify-email/${req.user.id}/${token.token}`
            await sendTokenEmail(req.user.email, link);
        }

        const updatedCarRental = await CarRental.findOne({ where: { id: req.user.id } });
        await transaction.commit();

        res.status(201).json({...updatedCarRental.dataValues,accessToken: generateToken({ id: carRental.id })});
    } catch (error) {
        console.log(error);
        if (transaction.finished) {
            console.log('Transaction already finished');
        } else {
            await transaction.rollback();
        }
        res.status(400).json({ message: error.message });
    }
});


const verifyEmail = asyncHandler(async (req, res) => {
    try {
      const { user_id: id, token } = req.params;
  
      const carRental = await CarRental.findOne({ where: { id } });
      if (!carRental) {
        throw new Error('Invalid Link');
      }
      if(carRental.verified){
        throw new Error('Email already verified');
      }
  
      const verifyToken = await Token.findOne({ where: { token } });
      if (!verifyToken) {
        throw new Error('Invalid Link');
      }
  
     // Delete the token
        await verifyToken.destroy();

      // Verify the token and check for expiration
       jwt.verify(token, process.env.JWT_SECRET, (err)=>{
        if(err){
            throw new Error('Token has expired');
        }
      });
  
      // Update carRental's 'verified' property to true
      await carRental.update({ verified: true });
  
    //   res.status(200).json({ message: 'Email verified' });
    // After email verification is successful
    res.status(400).send(`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .success-box {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            background-color: #fff;
          }
          p {
            color: green;
          }
          .btn {
            background-color: #0E69DD;
            border: 2px solid #0E69DD;
            color: white;
            text-transform: capitalize;
            font-size: 1rem; 
            padding: 0.75rem 1rem;
            border-radius: 0.375rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            text-decoration: none;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="success-box">
          <h1>Email Verification Status</h1>
          <p>Email verified successfully.</p>
          <a class="btn" href="https://xride.vercel.app/car-rental/login">Back to login</a>
        </div>
      </body>
    </html>
  `);

    } catch (error) {
        res.status(400).send(`
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .error-box {
                text-align: center;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                background-color: #fff;
              }
              p {
                color: red;
              }
              .btn {
                background-color: #0E69DD;
                border: 2px solid #0E69DD;
                color: white;
                text-transform: capitalize;
                font-size: 1rem; 
                padding: 0.75rem 1rem;
                border-radius: 0.375rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                text-decoration: none;
                display: inline-block;
              }
            </style>
          </head>
          <body>
            <div class="error-box">
              <h1>Email Verification Status</h1>
              <p>${error.message}.</p>
              <a class="btn" href="https://xride.vercel.app/car-rental/login">Back to login</a>
            </div>
          </body>
        </html>
      `);
      
    }
  });

  const resendEmailVerification = asyncHandler(async (req, res) => {
    try {
        const { email } = req.params;

        const carRental = await CarRental.findOne({ where: { email } });

        if (carRental) {
            const userHasToken = await Token.findOne({ where: { user_id: carRental.id } });

            try {
                // Delete old row code
                if (userHasToken) await userHasToken.destroy();
                const token = await Token.create({
                    user_id: carRental.id,
                    token: jwt.sign({payload:new Date().getTime()},process.env.JWT_SECRET,{ expiresIn: 60 * 10 }) 
                });

                    const link = `https://admin.xrideapp.com/api/v1/car-rental/auth/login/verify-email/${carRental.id}/${token.token}`;
                    console.log(link)
                // Sent email to the logging in account
                await sendTokenEmail(email, link);

                console.log('Token Succesfully generated')
                res.status(200).json({ message:'Email resent'});
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


const verifyJwt = (asyncHandler(async (req,res)=>{
    try{
        const { token } = req.params;
         // Verify the token and check for expiration
       jwt.verify(token, process.env.JWT_SECRET, (err)=>{

        try{
            if(err){
                throw new Error('unauthorized');
            }
            else{
                res.status(200).json({message:'authorized'})
            }
        }
        catch(error){
            res.status(400).json({message:error.message})
        }     
      });
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}))

const changeEmail = asyncHandler(async (req,res)=>{

    const { email, token } = req.body; 
    try{
        if(!email){
            throw new Error('unauthorized');
        }
        if(!token){
            throw new Error('unauthorized');
        }

        const foundEmail = await CarRental.findOne({where:{email}})
        console.log(foundEmail)

        if(foundEmail){
            throw new Error('Email Already Taken!');
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            try {
              if (err) {
                throw new Error('Email expired! resend a new one.');
              } else {
                await CarRental.update(
                  { email },
                  {
                    where: { id: decoded.payload },
                  }
                );
                res.status(200).json({ email });
              }
            } catch (error) {
              res.status(400).json({ message: error.message });
            }
          });
    }
    catch (error){
        res.status(400).json({message:error.message})
    }
})

const sendChangeEmailVerification = asyncHandler(async (req, res) => {
    try {
        const { email } = req.params;

        const carRental = await CarRental.findOne({ where: { email } });

        if (carRental) {
            const userHasToken = await Token.findOne({ where: { user_id: carRental.id } });

            try {
                // Delete old row code
                if (userHasToken) await userHasToken.destroy();
                const token = await Token.create({
                    user_id: carRental.id,
                    token: jwt.sign({payload:new Date().getTime()},process.env.JWT_SECRET,{ expiresIn: 60 * 10 }) 
                });
    
                    const link = `https://admin.xrideapp.com/api/v1/car-rental/auth/verify-change-email/${carRental.id}/${token.token}`;
                    console.log(link)
                // Sent email to the logging in account
                await sendTokenEmail(email, link);

                console.log('Token Succesfully generated')
                res.status(200).json({ message:'Email resent'});
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

const verifyChangeEmail = asyncHandler(async (req, res) => {
    try {
      const { user_id: id, token } = req.params;

  
      const carRental = await CarRental.findOne({ where: { id } });
      
      if (!carRental) {
        throw new Error('Invalid Link');
      }
  
      const verifyToken = await Token.findOne({ where: { token } });
      if (!verifyToken) {
        throw new Error('Invalid Link');
      }
  
     // Delete the token
        await verifyToken.destroy();

      // Verify the token and check for expiration
       jwt.verify(token, process.env.JWT_SECRET, (err)=>{
        if(err){
            throw new Error('Token has expired');
        }
      });
  
      const frontEndToken = jwt.sign({payload:carRental.id},process.env.JWT_SECRET,{ expiresIn: 60 * 10 })

    // After email verification is successful
    res.status(200).redirect(`https://web.xrideapp.com/car-rental/change-email?token=${frontEndToken}`)

    } catch (error) {
        res.status(400).json({ message: error.message });
      
    }
  });

  const changePassword = asyncHandler(async (req,res)=>{

    const { password, token } = req.body; 
    try{
        if(!password){
            throw new Error('unauthorized');
        }
        if(!token){
            throw new Error('unauthorized');
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            try {
              if (err) {
                throw new Error('Email expired! resend a new one.');
              } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                await CarRental.update(
                  { password: hashedPassword },
                  {
                    where: { id: decoded.payload },
                  }
                );
                res.status(200).json({ message:'success' });
              }
            } catch (error) {
              res.status(400).json({ message: error.message });
            }
          });
    }
    catch (error){
        res.status(400).json({message:error.message})
    }
})

const sendChangePasswordVerification = asyncHandler(async (req, res) => {
    try {
        const { email } = req.params;

        const carRental = await CarRental.findOne({ where: { email } });

        if (carRental) {
            const userHasToken = await Token.findOne({ where: { user_id: carRental.id } });

            try {
                // Delete old row code
                if (userHasToken) await userHasToken.destroy();
                const token = await Token.create({
                    user_id: carRental.id,
                    token: jwt.sign({payload:carRental.id},process.env.JWT_SECRET,{ expiresIn: 60 * 10 }) 
                });

                    const link = `https://admin.xrideapp.com/api/v1/car-rental/auth/verify-change-password/${carRental.id}/${token.token}`;
                    console.log(link)
                // Sent email to the logging in account
                await sendTokenEmail(email, link);

                console.log('Token Succesfully generated')
                res.status(200).json({ message:'Email resent'});
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

const verifyChangePassword = asyncHandler(async (req, res) => {
    try {
      const { user_id: id, token } = req.params;

  
      const carRental = await CarRental.findOne({ where: { id } });
      
      if (!carRental) {
        throw new Error('Invalid Link');
      }
  
      const verifyToken = await Token.findOne({ where: { token } });
      if (!verifyToken) {
        throw new Error('Invalid Link');
      }
  
     // Delete the token
        await verifyToken.destroy();

      // Verify the token and check for expiration
       jwt.verify(token, process.env.JWT_SECRET, (err)=>{
        if(err){
            throw new Error('Token has expired');
        }
      });
  
      const frontEndToken = jwt.sign({payload:carRental.id},process.env.JWT_SECRET,{ expiresIn: 60 * 10 })

    // After email verification is successful
    res.status(200).redirect(`https://web.xrideapp.com/car-rental/change-password?token=${frontEndToken}`)

    } catch (error) {
        res.status(400).json({ message: error.message });
      
    }
  });
const credentials = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password ) {
            res.status(400);
            throw new Error('Add all fields!');
        }

        const userExists = await CarRental.findOne({ where: { email } });
        if (userExists) {
            res.status(400);
            throw new Error('Email already exists');
        }
        if (password.length < 6) {
            res.status(400);
            throw new Error('At least 7 char!');
        }
        res.status(200).json({ message: 'valid credentials' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    };
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
            user = await CarRental.findOne({ where: { email } });
        } catch (error) {
            res.status(500);
            throw new Error('Network Error');
        }
        const matchingPasswords = await bcrypt.compare(password, user?.password);
        console.log(matchingPasswords)
        // Check if user exists and password matched && (await bcrypt.compare(password, user.password))
        if (user && matchingPasswords) {
         
        if(!hasDayPassed(user.logged_in_date)){
          await user.update({logged_in_date: new Date()})
          res.status(200).json({
            id: user.id,
            email: user.email,
            company_name: user.company_name,
            landline_number: user.landline_number,
            api_docs_url: user.api_docs_url,
            api_key: user.api_key,
            branches: user.branches,
            delivery_options: user.delivery_options,
            company_logo: user.company_logo,
            stamp: user.stamp,
            vat_number: user.vat_number,
            verified: user.verified,
            createdAt: user.createdAt,
            otp_not_required : true,
            accessToken: generateToken({ id: user.id })
          });
      }
      else{
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
      }

        } else {
            res.status(400);
            throw new Error('Invalid Credentials');
        }
    } catch (error) {
      console.log(error)
        res.status(400);
        throw error;
    }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const updatedValues = req.body;
    try {
      const carRental = await CarRental.findOne({ where: { id: req.user.id } });
      if (!carRental) {
        return res.status(404).json({ message: 'Car rental not found' });
      }
  
      const changedValues = {};
      
      // Loop through the keys in updatedValues and compare them with carRental attributes
      for (const key of Object.keys(updatedValues)) {
        if (updatedValues[key] !== carRental[key]) {
          if (key === "delivery_options") {
            // Check if the attribute is "delivery_options"
            console.log(JSON.parse(updatedValues[key]))
            changedValues[key] = JSON.parse(updatedValues[key]).join(',')
          }
          else{
            changedValues[key] = updatedValues[key];
          }
         
        }
      }
  
      // Update only the changed values
      if (Object.keys(changedValues).length > 0) {
        const updatedCarRental = await carRental.update(changedValues, { individualHooks: true });
        console.log(updatedValues)
        console.log(changedValues)
        res.status(200).json(updatedCarRental);
      } else {
        res.status(400).json({ message: 'No values has changed' });
      }

    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error updating car rental' });
    }
  });
  

const counts = asyncHandler(async (req, res) => {
    try {
        const activeCars = await Car.count({
            where: { car_rental_id: req.user.id, active: true,}
        });
        const cars = await Car.count({
            where: { car_rental_id: req.user.id}
        });
        // const categories = await Category.count({
        //     where: { car_rental_id: req.user.id }
        // });
        const bookings = await Booking.count({
            include: [
                { model: Car, where: { car_rental_id: req.user.id } }
            ]
        });
        // const branches = await Branch.count({
        //     where: { car_rental_id: req.user.id }
        // });

        // res.json({ activeCars, cars, categories, bookings, branches });
        res.json({ activeCars, cars, bookings });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

// const getBranches = asyncHandler(async (req, res) => {
//     try {
//         const branches = await Branches.findAll({
//             where: { car_rental_id: req.user.id },
//             include: [{ model: CarRental }]
//         });

//         res.status(200).json(branches)
//     } catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// });


const addBranch = asyncHandler(async (req, res) => {
  const {location,address,open_days,open_time,close_time} = req.body
  const transaction = await sequelize.transaction();
    try {
      const genId = cuid();
      const modifiedId = genId.substring(genId.length - 10);
      const newBranch = await Branches.create({
        id:modifiedId,
        car_rental_id: req.user.id, // Set the car_rental_id
        location,
        address,
        open_days,
        open_time,
        close_time,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
        const branches = await Branches.findAll({
            where: { car_rental_id: req.user.id }
        });
        console.log(branches)
        const carRental = await CarRental.update({
          updatedAt: new Date(), // Updated the updatedAt field
          branches:branches,  // Update the associated Branches
        }, {
          where: { id: req.user.id },
          include: [Branches], // Include the associated Branches for updating
          returning: true, // To get the updated record as a result
        });
        await transaction.commit()
        res.status(200).json(branches)
    } catch (error) {
      if (transaction.finished) {
        console.log('Transaction already finished');
    } else {
        await transaction.rollback();
    }
    res.status(400).json({ message: error.message });
    }
});

const updateBranch = asyncHandler(async (req, res) => {
  const {id,location,address,open_days,open_time,close_time} = req.body
  const transaction = await sequelize.transaction();
    try {
      const updatedBranch = await Branches.update({
        location,
        address,
        open_days,
        open_time,
        close_time,
        updatedAt: new Date(),
      },{where:{id}});
        const branches = await Branches.findAll({
            where: { car_rental_id: req.user.id },
        });
        const carRental = await CarRental.update({
          updatedAt: new Date(), // Updated the updatedAt field
          branches:branches,  // Update the associated Branches
        }, {
          where: { id: req.user.id },
          include: [Branches], // Include the associated Branches for updating
          returning: true, // To get the updated record as a result
        });
        await transaction.commit()
        res.status(200).json(branches)
    } catch (error) {
      if (transaction.finished) {
        console.log('Transaction already finished');
    } else {
        await transaction.rollback();
    }
    res.status(400).json({ message: error.message });
    }
});

const secondPageAgreement = asyncHandler(async (req, res) => {
    try {
        const { agreement } = req.body;

        const carRental = await CarRental.findOne({
            where: { id: req.user.id }
        });
        carRental.second_page_agreement = agreement;
        await carRental.save();
        req.user.second_page_agreement = agreement;
        await req.user.save();

        res.status(200).json({ message: "Agreement updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
                console.log(otp.code)
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

const profilePicture = asyncHandler(async (req, res) => {
    try {
        console.log(req.file);
        const { originalname, buffer } = req.file; // Get the original filename and buffer of the uploaded file

        const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Replace with the name of your bucket
        const fileName = 'carRentals/logos/' + req.user.company_name + "_" + req.user.id  + Math.floor(Math.random() * 1001) + '.' + req.file.mimetype.split('/')[1];
        const deleteName = 'carRentals/logos/' + req.user.company_logo.split('/')[req.user.company_logo.split('/').length-1];
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);
        const fileToDelete = bucket.file(deleteName)
        // Upload the file to the bucket
        await fileToDelete.delete()
        await file.save(buffer);

        // Get the public URL for the file
        const url = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        console.log(url);

        // const [numUpdated, updatedCarRental]
        const  updatedCarRental = await CarRental.update(
            { company_logo: url }, // Store the public URL in the database
            { where: { id: req.user.id } }
        );
        res.status(200).json(updatedCarRental);

        req.user.company_logo = url;
        await req.user.save();
    } catch (error) { 
        res.status(400).json({ message: error.message });
    };
});

const updateStamp = asyncHandler(async (req, res) => {
    try {
        
        const {account_stamp : stamp} = req.body
        const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; 
        const  fileName = 'carRentals/stamps/' + req.user.company_name + '_' +  req.user.id + Math.floor(Math.random() * 1001)+ '.png';
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);
        const buffer = Buffer.from(stamp.uri.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      
        const deleteName = 'carRentals/stamps/' + req.user.stamp.split('/')[req.user.stamp.split('/').length-1];
        const fileToDelete = bucket.file(deleteName)
        // Upload the file to the bucket
        await fileToDelete.delete()
    
             // Upload the file to the bucket    
          const stream = file.createWriteStream({
              metadata: {
                contentType: stamp.type,
              },
            });
            
            stream.on('error', (err) => {
              console.error(err);
            });
            
            stream.on('finish', () => {
              console.log(`Image uploaded to ${fileName}.`);
            });
            
            stream.end(buffer);
          // Get the public URL for the file
          const url = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        const  updatedCarRental = await CarRental.update(
            { stamp: url }, // Store the public URL in the database
            { where: { id: req.user.id } }
        );
    
        res.status(200).json(updatedCarRental);

        req.user.stamp = url;
        await req.user.save();
    } catch (error) { 
        res.status(400).json({ message: error.message });
    };
});

const me = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
}

module.exports = {
    secondPageAgreement,
    profilePicture,
    addBranch,
    updateBranch,
    // getBranches,
    verifyOtp,
    verifyJwt,
    signup,
    completeSignup,
    updateStamp,
    changeEmail,
    changePassword,
    verifyEmail,
    updateAccountDetails,
    credentials,
    resend,
    resendEmailVerification,
    sendChangeEmailVerification,
    verifyChangeEmail,
    verifyChangePassword,
    sendChangePasswordVerification,
    counts,
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

function sendTokenEmail(email,link) {
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
            subject: 'Email verification',
            text: link,
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

