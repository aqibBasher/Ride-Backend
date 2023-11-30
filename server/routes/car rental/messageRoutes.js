const router = require('express').Router();

const { getMessages, getRooms, getRoom, saveMessage, createRoom, seenMessage } = require('../../controllers/car rental/messageController');
const { protectCarRental } = require('../../middlewares/protectCarRental');

router.post('/get-all-messages', protectCarRental, getMessages);
router.post('/save-message', protectCarRental, saveMessage);
router.post('/create-room',protectCarRental, createRoom);
router.post('/seen-message',protectCarRental, seenMessage);
router.get('/get-rooms', protectCarRental, getRooms);
router.get('/get-room/:id', protectCarRental, getRoom);

module.exports = router;