const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define('Reviews', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rating: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    placed_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    car_rental_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        index: {
            expires: 30
        }
    }
}, { timestamps: false });