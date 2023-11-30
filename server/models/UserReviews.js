const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const Bookings = require('./Bookings');
const CarRentals = require('./CarRentals');
const Users = require('./User');

const UserReviews = sequelize.define('UserReview', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(300),
        allowNull: false,
    },
    rating: {
        type: Sequelize.DECIMAL(10, 1),
        allowNull: false
    },
    placed_date: {
        type: Sequelize.DATE,
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

Users.hasMany(UserReviews, { foreignKey: 'user_id' });
UserReviews.belongsTo(Users, { foreignKey: 'user_id' });

CarRentals.hasMany(UserReviews, { foreignKey: 'car_rental_id' });
UserReviews.belongsTo(CarRentals, { foreignKey: 'car_rental_id' });

Bookings.hasOne(UserReviews, { foreignKey: 'booking_id' });
UserReviews.belongsTo(Bookings, { foreignKey: 'booking_id' });

module.exports = UserReviews;