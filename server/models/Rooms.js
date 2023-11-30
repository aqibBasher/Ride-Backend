const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const Booking = require('./Bookings');
const User = require('./User');
const CarRental = require('./CarRentals');

const Rooms = sequelize.define('Room', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, { timestamps: false });

CarRental.hasMany(Rooms, { foreignKey: 'car_rental_id' });
Rooms.belongsTo(CarRental, { foreignKey: 'car_rental_id' });

User.hasMany(Rooms, { foreignKey: 'user_id' });
Rooms.belongsTo(User, { foreignKey: 'user_id' });

Booking.hasOne(Rooms, { foreignKey: 'booking_id' });
Rooms.belongsTo(Booking, { foreignKey: 'booking_id' });

module.exports = Rooms;
