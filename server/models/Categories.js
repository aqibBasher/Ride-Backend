const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const Categories = sequelize.define('Categories', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    original_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    live: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    cars: Sequelize.INTEGER,
    seats: Sequelize.INTEGER,
    doors: Sequelize.STRING,
    transmission: Sequelize.STRING,
    features: Sequelize.JSON,
    km: Sequelize.STRING,
    unlimitedKm: Sequelize.BOOLEAN,
    deposit_fee: Sequelize.STRING,
    percent: Sequelize.STRING,
    final_rate: Sequelize.DOUBLE(10, 2),
    available_cars: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      added_percentage: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      booking_type: {
        type: Sequelize.STRING,
        allowNull: true,
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



module.exports = Categories;