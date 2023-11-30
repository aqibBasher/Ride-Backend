const router = require('express').Router();

const {
    getAllCars, getOneCar, updateNewState, editCar, verifyCar, verifyCarByAdmin, getAllCarsForOneCarRental,
    verifyAllCarsForOneCarRental
} = require('../../controllers/administration/carController');
const { protect } = require('../../middlewares/protect');

router.get('/get-all-cars', protect, getAllCars);
router.get('/get-one-car/:id', protect, getOneCar);
router.put('/updates/:id', protect, updateNewState);
router.put('/edit/:id', protect, editCar);
router.put('/verify/:id', protect, verifyCar);
router.put('/verify-by-admin/:id', protect, verifyCarByAdmin);
router.get('/get/:id', protect, getAllCarsForOneCarRental);
router.put('/submit/:id', protect, verifyAllCarsForOneCarRental);
// router.put('/viewed/:id', protect, viewedVerifiedCars);

module.exports = router;