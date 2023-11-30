const router = require('express').Router();

const { getRoom, getRooms } = require('../../../controllers/webservices/xride-business/chatController');

router.get('/get-room/:roomId/:car_rental_id', getRoom);
router.get('/get-rooms/:car_rental_id', getRooms);

module.exports = router;