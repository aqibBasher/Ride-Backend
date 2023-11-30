const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const Users = require('./User');
const Cars = require('./Cars');
const Categories = require('./Categories');
const CarRentals = require('./CarRentals');

const Bookings = sequelize.define('Bookings', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    placed_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    pickup_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    dropoff_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    pickup_location: {
        type: Sequelize.JSON,
        allowNull: false
    },
    dropoff_location: {
        type: Sequelize.JSON,
        allowNull: false
    },
    pickup_address: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    dropoff_address: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    booking_status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    canceled_date: Sequelize.DATE,
    cancelation_reason: Sequelize.STRING,
    cancelation_party:{
        type:Sequelize.STRING,
        allowNull:false
    }
}, { timestamps: false });

Users.hasMany(Bookings, { foreignKey: 'user_id' });
Bookings.belongsTo(Users, { foreignKey: 'user_id' });

CarRentals.hasMany(Bookings, { foreignKey: 'car_rental_id' });
Bookings.belongsTo(CarRentals, { foreignKey: 'car_rental_id' });

// add migration

Cars.hasMany(Bookings, { foreignKey: 'car_id' });
Bookings.belongsTo(Cars, { foreignKey: 'car_id' });

Categories.hasMany(Bookings, { foreignKey: 'car_categories_id' });
Bookings.belongsTo(Categories, { foreignKey: 'car_categories_id' });

module.exports = Bookings;