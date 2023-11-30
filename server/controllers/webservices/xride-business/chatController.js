const asyncHandler = require('express-async-handler');
// const Booking = require('../../models/Bookings');
const User = require('../../../models/User');
const Room = require('../../../models/Rooms');
const Message = require('../../../models/Messages');

const getRoom = asyncHandler(async (req, res) => {
    try {
        const { roomId, car_rental_id } = req.params;
        const room = await Room.findOne({
            where: { car_rental_id, id: roomId },
            include: [
                { model: User },
                { model: Message }
            ]
        });

        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getRooms = asyncHandler(async (req, res) => {
    try {
        const { car_rental_id } = req.params;
        const rooms = await Room.findAll({
            where: { car_rental_id },
            include: [
                { model: User },
                { model: Message }
            ]
        });

        res.status(200).json(rooms);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = {
    getRoom,
    getRooms
}