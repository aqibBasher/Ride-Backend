const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const Administration = sequelize.define('Administration', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(300),
        allowNull: false
    },
    first_name: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    role: {
        type: Sequelize.ENUM('admin', 'user'),
        allowNull: false
    }
});

module.exports = Administration;