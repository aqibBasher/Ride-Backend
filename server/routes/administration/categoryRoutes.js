const router = require('express').Router();

const {
    getAllCategoriesForOneCarRental, submitCategoriesSet,
    getOneCategory,
    additionalInfoUpdate, featuresUpdate, ratesUpdate
} = require('../../controllers/administration/categoryController');
const { protect } = require('../../middlewares/protect');

router.get('/get-all/:id', protect, getAllCategoriesForOneCarRental);
router.put('/submit-categories/:id', protect, submitCategoriesSet);
router.get('/get-one-category/:category_id/:car_rental_id', protect, getOneCategory);
// router.get('/get-decreases/:id', protect, getDecreases);
// router.post('/add-decreasing', protect, addDecreasing);
// router.post('/delete-decreasing/:id', protect, deleteDecreasing);
router.post('/update-category-additional-info', protect, additionalInfoUpdate);
router.post('/update-category-features', protect, featuresUpdate);
router.post('/update-category-rates', protect, ratesUpdate);

module.exports = router;