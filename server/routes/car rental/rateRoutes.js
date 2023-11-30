const router = require('express').Router();

const {
    getCategory, getOneCategory,
    update,goLive,
    additionalInfoUpdate, featuresUpdate, ratesUpdate, updatePhotos , addCategory , getCategories
} = require('../../controllers/car rental/rateController');
const { protectCarRental } = require('../../middlewares/protectCarRental');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/get-categories', protectCarRental, getCategory);
router.post('/update-category-additional-info', protectCarRental, additionalInfoUpdate);
router.post('/update-category-features', protectCarRental, featuresUpdate);
 router.post('/update-category-rates', protectCarRental, ratesUpdate);
router.get('/get-one-category/:id', protectCarRental, getOneCategory);
router.post('/update-rates/:id/:type/:car_rental_id', upload.any('photos'), protectCarRental, updatePhotos);
router.put('/go-live', protectCarRental, goLive);
router.post('/add-category',addCategory);
router.get('/get-category-list', getCategories);
// router.post('/add-car-details',protectCarRental,addCarDetails);
// router.get('/get-seasons-categories', protectCarRental, getSeasonsCategories);

module.exports = router;
