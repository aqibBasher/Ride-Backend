const asyncHandler = require('express-async-handler');
const Booking = require('../../models/Bookings');
const User = require('../../models/User');
const Room = require('../../models/Rooms');
const Message = require('../../models/Messages');
const cuid = require('cuid');

const getMessages = asyncHandler(async (req, res) => {

    const { room_id } = req.body
    try {
        const messages = await Message.findAll({
            where: {  room_id},
                    });

        
        res.status(200).json(messages);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
});

const saveMessage = asyncHandler(async (req, res) => {
    const { message, online, seen, room_id } = req.body; // Assuming room_id is part of the request body
  
    try {
      // Check if the room exists
      const room = await Room.findOne({ where: { id: room_id } });
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      const genId = cuid();
      const modifiedId = genId.substring(genId.length - 10);
  
      const messageCreated = await Message.create({
        id: modifiedId,
        sender: req.user.id,
        message,
        online,
        seen,
        room_id, 
        createdAt: new Date().toISOString(),
      });
  
      res.status(200).json(messageCreated);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }); 

const createRoom = asyncHandler(async (req, res) => {

    const genId = cuid();
    const modifiedId = genId.substring(genId.length - 10);

    try {
        const { user_id,booking_id } = req.body;

        const foundRoom = await Room.findOne({where:{booking_id,user_id,car_rental_id:req.user.id}})
        
       if(!foundRoom){
        const room = await Room.create({
            id: booking_id,
            booking_id,
            user_id,
            createdAt: new Date(),
            updatedAt: new Date(),
            car_rental_id: req.user.id,
        });
        res.status(201).json(room);
       }
       else{
        res.status(200).json({message:'Room exists'})
       }
        

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
});


const seenMessage = asyncHandler(async (req, res) => {

    try {
        const { id,messages } = req.body;
        
        messages.forEach(async message => {
            await Message.update({
                seen: true
             },{where:{id:message.id,room_id:id}});
        });
    
        res.status(200).json({message:'success'})

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
});


const getRoom = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findOne({
            where: { car_rental_id: req.user.id, id },
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
        const rooms = await Room.findAll({
            where: { car_rental_id: req.user.id },
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
    getMessages,
    saveMessage,
    createRoom,
    getRooms,
    getRoom,
    seenMessage
}