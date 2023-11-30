const router = require('express').Router();

const { addCarApi1 } = require('../../../controllers/administration/apis/api1Controller');
const { addCarApi2 } = require('../../../controllers/administration/apis/api2Controller');
const { protect } = require('../../../middlewares/protect');

router.get('/api1', protect, addCarApi1);
router.get('/api2', protect, addCarApi2);

module.exports = router;