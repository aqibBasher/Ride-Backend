const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const CarRentals = require('./CarRentals');
const Category = require('./Categories');

const Cars = sequelize.define('Car', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    make: Sequelize.STRING(50),
    model: Sequelize.STRING(300),
    year: Sequelize.INTEGER(11),
    // seats: Sequelize.INTEGER,
    // doors: Sequelize.STRING,
    // transmission: Sequelize.STRING,
    bags: Sequelize.INTEGER,
    currency: Sequelize.STRING,
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    color_name: Sequelize.STRING,
    plate_number: Sequelize.INTEGER,
    vin_number: Sequelize.STRING,
    engine_number: Sequelize.STRING,
    photos: Sequelize.JSON,
    damage_points: Sequelize.JSON,
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, { timestamps: false });

CarRentals.hasMany(Cars, { foreignKey: 'car_rental_id' });
Cars.belongsTo(CarRentals, { foreignKey: 'car_rental_id' });

Category.hasMany(Cars, { foreignKey: 'car_categories_id' });
Cars.belongsTo(Category, { foreignKey: 'car_categories_id' });

module.exports = Cars;