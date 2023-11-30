const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const CarRentals = require('./CarRentals');

const Branches = sequelize.define('Branch', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    location: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    open_days: {
        type: Sequelize.JSON,
        allowNull: false
    },
    open_time: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    close_time: {
        type: Sequelize.STRING(50),
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
}, { timestamp: false });

CarRentals.hasMany(Branches, { foreignKey: 'car_rental_id' });
Branches.belongsTo(CarRentals, { foreignKey: 'car_rental_id' });

module.exports = Branches;