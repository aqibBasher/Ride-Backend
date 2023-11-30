const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define('TermsVersions', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    version: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    }
}, { timestamps: false });