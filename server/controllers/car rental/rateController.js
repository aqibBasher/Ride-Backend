const asyncHandler = require('express-async-handler');
const { Storage } = require('@google-cloud/storage');
const Categories = require('../../models/Categories');
const Booking = require('../../models/Bookings');
const Car = require('../../models/Cars');
const path = require('path');
const User = require('../../models/User');
const cuid = require('cuid');
const Rates = require('../../models/Rates');
const carCategories = require('../../models/CarCategories');
const carDetails = require('../../models/carsDetails')

const getCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Categories.findAll({
            where: { car_rental_id: req.user.id, verified: true },
            include: [
                { model: Car }
            ]
        });
        res.status(200).json(category);
    } catch (error) {
        console.log(error)
        res.status(400);
        throw error;
    }
});

const goLive = asyncHandler(async (req, res) => {
    try {
        const [numUpdated, updatedCategory] = await Categories.update(
            { live: true },
            { where: { live: false, car_rental_id: req.user.id, verified: true } }
        );
        res.status(200).json({ numUpdated, updatedCategory });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getOneCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Categories.findOne({
            where: { id, car_rental_id: req.user.id }, //live: false, verified: false
            include: [
                // { model: Car, where: { car_rental_id: req.user.id } },
                {
                    model: Booking, include: [{ model: User }]
                }
                // { model: SeasonsCategories }
            ]
        });
        res.status(200).json(category);
    } catch (error) {
        console.log(error)
        res.status(400);
        throw error;
    }
});



const storage = new Storage({
    keyFilename: path.join(__dirname, '../../../xride-key.json')
});

const updatePhotos = asyncHandler(async (req, res) => {
    try {
        const PHOTOS = req.files || [];
        const TMP = req.body;
        const { id, type, car_rental_id } = req.params;
        console.log(PHOTOS);

        console.log('TMP:', TMP);
        console.log('TMP type:', typeof TMP);
        console.log('TMP length:', TMP.length);

        const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Replace with the name of your bucket
        const bucket = storage.bucket(bucketName);

        for (let i = 0; i < PHOTOS.length; i++) {
            const { originalname, buffer } = PHOTOS[i]; // Get the original filename and buffer of the uploaded file
            const fileName = `${type}-${car_rental_id}/${originalname}`;
            const file = bucket.file(fileName);

            // Upload the file to the bucket
            await file.save(buffer);

            // Get the public URL for the file
            const url = `https://storage.googleapis.com/${bucketName}/${fileName}`;

            await CategoryPhotos.create({ url, car_cartegories_id: id });
        }

        for (const key of Object.keys(TMP)) {
            console.log('Looping');
            const url = TMP[key];

            // Remove the base URL to get the file path
            const filePath = url.replace('https://storage.googleapis.com/xride_images_storage-1/', '');
            console.log('File path:', filePath);

            try {
                // Delete the file from the bucket
                await storage.bucket(bucketName).file(filePath).delete();
                await CategoryPhotos.destroy({ where: { car_cartegories_id: id, url } });
                console.log('File deleted:', filePath);
            } catch (error) {
                console.error('Error deleting file:', error);
                // Handle the error appropriately (e.g., logging, error response)
            }
        }

        const newPhotos = await CategoryPhotos.findAll({ where: { car_cartegories_id: id } });

        res.status(200).json({ message: "photos uploaded successfully!", photos: newPhotos });
    } catch (error) {
        if (error instanceof Error && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size too large' });
        }
        res.status(400).json({ message: error.message });
    }
});

const update = asyncHandler(async (req, res) => {
    try {
        const { id, type, car_rental_id } = req.params;
        const { weekday_rate, weekend_rate, features, seats, doors, transmission, km, unlimitedKm, deposit_fee } = req.body;
        const PHOTOS = req.files || [];

        const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Replace with the name of your bucket
        const bucket = storage.bucket(bucketName);
        const transaction = await sequelize.transaction();

        // Update the category details
        const [numRowsUpdated, updatedCarCategory] = await Category.update(
            {
                weekday_rate: Number(weekday_rate),
                weekend_rate: Number(weekend_rate),
                features,
                seats: Number(seats),
                doors,
                transmission,
                unlimitedKm,
                deposit_fee,
                km
            },
            { where: { id }, transaction }
        );

        // Delete the previous photos for this category
        await CategoryPhotos.destroy({ where: { car_cartegories_id: id }, transaction });

        // Add the new photos for this category
        for (let i = 0; i < PHOTOS.length; i++) {
            const { originalname, buffer } = PHOTOS[i]; // Get the original filename and buffer of the uploaded file
            const fileName = `${type}-${car_rental_id}/${originalname}`;
            const file = bucket.file(fileName);

            // Upload the file to the bucket
            await file.save(buffer);

            // Get the public URL for the file
            const url = `https://storage.googleapis.com/${bucketName}/${fileName}`;

            await CategoryPhotos.create({ url, car_cartegories_id: id }, { transaction });
        }

        await transaction.commit();

        if (numRowsUpdated > 0) {
            res.status(200).json(updatedCarCategory);
        }
    } catch (error) {
        if (error instanceof Error && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size too large' });
        }
        res.status(400).json({ message: error.message });
    }
});



const additionalInfoUpdate = asyncHandler(async (req, res) => {
    try {
        let { id, seats, doors, transmission, km, unlimitedKm } = req.body;

        if (!id, !seats, !doors, !transmission) {
            res.status(400);
            throw new Error('all fields required!');
        }
        if (unlimitedKm === true) {
            km = '';
        }

        const [numUpdated, updatedCategories] = await Categories.update(
            { seats, doors, transmission, km, unlimitedKm },
            { where: { car_rental_id: req.user.id, id: id } }
        );
        res.status(200).json({ numUpdated, updatedCategories, seats, doors, transmission, km, unlimitedKm });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const ratesUpdate = asyncHandler(async (req, res) => {
    try {
        const { id, percent, final_rate, deposit_fee, same_rate } = req.body;

        if (((percent === '0' || !percent) && same_rate === false)) {
            res.status(400);
            throw new Error('all fields required!');
        }

        if (same_rate === true) {
            const [numUpdated, updatedCategories] = await Categories.update(
                { deposit_fee, final_rate, percent },
                { where: { car_rental_id: req.user.id, id: id } }
            );

            const rates = { deposit_fee };

            res.status(200).json({ numUpdated, updatedCategories, rates });
        } else {
            const [numUpdated, updatedCategories] = await Categories.update(
                { final_rate, percent, deposit_fee },
                { where: { car_rental_id: req.user.id, id: id } }
            );

            const rates = { final_rate, percent, deposit_fee };

            res.status(200).json({ numUpdated, updatedCategories, rates });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const featuresUpdate = asyncHandler(async (req, res) => {
    try {
        const { id, features } = req.body;

        const [numUpdated, updatedFeatures] = await Categories.update(
            { features },
            { where: { car_rental_id: req.user.id, id: id } }
        );
        res.status(200).json({ numUpdated, updatedFeatures, features: JSON.stringify(features) });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const addCategory = asyncHandler(async (req, res) => {
    try {
        const ratesData = req.body.rates;
        const detailsOfCars = req.body.carDetails;
        const carType = req.body.type;
        const features = req.body.features;
        // const categoryId = req.body.car_category_id;
        console.log(ratesData);
        // Insert in category
        const objectToInsert = {
            type: carType,
            features: JSON.stringify(features)

        }
        console.log("objectToInsert", objectToInsert);
        const addCategory = await carCategories.create(objectToInsert);
        console.log("here is categories id to be inserted ------", addCategory);


        // Insert car details
        const categoryId = addCategory?.dataValues?.car_category_id;
        console.log("categoryId",categoryId);
        if(!categoryId){
            throw "Something went wrong while inserting into categories";
        }
        const saveCarDetails = await Promise.all(
            detailsOfCars.slice(1).map(async (car) => {
                console.log(categoryId);
                car.car_category_id = categoryId;
                const newCarDetail = await carDetails.create(car);
                return newCarDetail;
            })
        );

        // Iterate through the rates array and save each entry
        const savedRates = await Promise.all(
            ratesData.slice(1).map(async (rateEntry) => {
                rateEntry.car_category_id = categoryId;
                const newRate = await Rates.create(rateEntry);
                return newRate;
            })
        );

        res.status(201).json("data inserted successfully");
    } catch (error) {
        console.log(error)
        res.status(400);
        throw error;
    }
});

const transformedData = (sourceArray=>{
    return sourceArray.map((car) => {
        const make = car.car_make;
        const model = car.car_model;
        const engineType = car.transmission === 'auto' ? 'Automatic' : 'Manual';
        const seats = car.car_seats;
        const doors = car.car_doors;

        
        const features = Object.entries(car.features[0])
        .filter(([feature, value]) => value === true)
        .map(([feature]) => ({ name: feature }));

        return {
            type: car.type.toLowerCase(),
            make,
            model,
            engine_type: engineType,
            seats,
            doors,
            switch: car.available === 1,
            features,
        };
    })
});

const getCategories = asyncHandler(async (req, res) => {
    try {
        const rawQuery = `
                        SELECT *
                        FROM CarDetails det
                        INNER JOIN CarCategories cat ON cat.car_category_id = det.car_category_id
                        `;

        global.sequelize.query(rawQuery, { type: sequelize.QueryTypes.SELECT })
            .then(results => {
                console.log('-------------------------------');
                console.log(results);
                res.json(transformedData(results)); // Use res.json() to send JSON response

            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send an appropriate response
            });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = {
    updatePhotos,
    additionalInfoUpdate,
    ratesUpdate,
    featuresUpdate,
    getOneCategory,
    getCategory,
    goLive,
    update,
    addCategory,
    getCategories
    // addCarDetails
};

