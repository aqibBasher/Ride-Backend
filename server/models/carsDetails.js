const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const carCategories = require('./CarCategories')

const CarDetailsModel = sequelize.define('CarDetails', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    car_make: Sequelize.STRING,
    car_model: Sequelize.STRING,
    year: Sequelize.INTEGER,
    transmission: Sequelize.STRING,
    car_doors: Sequelize.INTEGER,
    car_seats: Sequelize.INTEGER,
    available: Sequelize.BOOLEAN,
    car_rental_id: Sequelize.INTEGER,
    car_category_id: Sequelize.INTEGER,
    createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
}, { timestamps: false });


// CarDetailsModel.belongsTo(carCategories, { foreignKey: 'car_category_id' });
module.exports = CarDetailsModel ;