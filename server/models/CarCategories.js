const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const CarDetailsModel = require ('./carsDetails');
const Rates = require('./Rates')
const CarCategories = sequelize.define('CarCategories', {
      car_category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true

      },
      car_rental_id: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      features:{
        type: Sequelize.STRING, 
      },
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

CarDetailsModel.belongsTo(CarCategories, { foreignKey: 'car_category_id' });
CarCategories.hasMany(CarDetailsModel, { foreignKey: 'car_category_id' });




module.exports = CarCategories;
