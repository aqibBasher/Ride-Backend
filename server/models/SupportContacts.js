const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const Bookings = require('./Bookings');
const CarRentals = require('./CarRentals');
const Users = require('./User');

const SupportContacts = sequelize.define('SupportContacts', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(300),
        allowNull: false,
    },
    label: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    resolved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    submited_date: Sequelize.DATE,
    other: Sequelize.STRING,
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, { timestamps: false });

Users.hasMany(SupportContacts, { foreignKey: 'user_id' });
SupportContacts.belongsTo(Users, { foreignKey: 'user_id' });

CarRentals.hasMany(SupportContacts, { foreignKey: 'car_rental_id' });
SupportContacts.belongsTo(CarRentals, { foreignKey: 'car_rental_id' });

Bookings.hasOne(SupportContacts, { foreignKey: 'booking_id' });
SupportContacts.belongsTo(Bookings, { foreignKey: 'booking_id' });

module.exports = SupportContacts;