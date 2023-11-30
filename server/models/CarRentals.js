const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const CarRentals = sequelize.define('CarRentals', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    company_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    company_logo: {
        type: Sequelize.STRING(400),
        allowNull: false
    },
    stamp: Sequelize.STRING(400),
    api_key: Sequelize.STRING(255),
    api_docs_url: {
        type: Sequelize.STRING(400),
        allowNull: true
    },
    email: {
        type: Sequelize.STRING(400),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    vat_number: Sequelize.STRING(400),
    verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    delivery_options: {
        type: Sequelize.JSON,
        allowNull: true
    },
    landline_number: {
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
    },
    logged_in: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    logged_in_date: {
        type: Sequelize.DATE,
        allowNull: true
    },
    cars: {
        type: Sequelize.JSON,
        allowNull: true
    },
    categories: {
        type: Sequelize.JSON,
        allowNull: true
    },
    bookings: {
        type: Sequelize.JSON,
        allowNull: true
    },
    active_cars: {
        type: Sequelize.JSON,
        allowNull: true
    },
    joined_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    branches: {
        type: Sequelize.JSON,
        allowNull: true
    },
    reviews: {
        type: Sequelize.JSON,
        allowNull: true
    },
    second_page_agreement: {
        type: Sequelize.STRING,
        allowNull: true
    },
    live: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, { timestamps: false });

module.exports = CarRentals;

