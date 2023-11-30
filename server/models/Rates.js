

const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const CarCategories =  require('./CarCategories')

const Rates = sequelize.define('Rates', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    start_date: Sequelize.DATE,
    end_date: Sequelize.DATE,
    rate: Sequelize.FLOAT,
    status: Sequelize.STRING,
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

Rates.belongsTo(CarCategories,{foreignKey:'car_category_id'});
CarCategories.hasMany(Rates , {foreignKey : 'car_category_id'});

module.exports = Rates;