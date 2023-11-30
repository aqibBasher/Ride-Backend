const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const Users = require('./User');
const CarRentals = require('./CarRentals');
const Bookings = require('./Bookings');

const CarRentalReviews = sequelize.define('CarRentalReview', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
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

Users.hasMany(CarRentalReviews, { foreignKey: 'user_id' });
CarRentalReviews.belongsTo(Users, { foreignKey: 'user_id' });

CarRentals.hasMany(CarRentalReviews, { foreignKey: 'car_rental_id' });
CarRentalReviews.belongsTo(CarRentals, { foreignKey: 'car_rental_id' });

// associated with bookings
Bookings.hasMany(CarRentalReviews, { foreignKey: 'booking_id' });
CarRentalReviews.belongsTo(Bookings, { foreignKey: 'booking_id' });


module.exports = CarRentalReviews;