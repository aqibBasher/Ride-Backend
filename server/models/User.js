const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const Users = sequelize.define('User', {
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
        type: Sequelize.STRING(255),
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
    first_name: Sequelize.STRING(30),
    last_name: Sequelize.STRING(30),
    date_of_birth: Sequelize.DATE,
    age: Sequelize.INTEGER(11),
    profile_photo: Sequelize.STRING(300),
    phone_number: Sequelize.STRING(30),
    country_code: Sequelize.STRING(30),
    permenant_address: Sequelize.STRING(200),
    verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    rent_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    nationality: Sequelize.STRING(100),
    father_name: Sequelize.STRING(100),
    mother_name: Sequelize.STRING(100),
    driving_license_number: Sequelize.STRING(100),
    passport_number: Sequelize.STRING(100),
    id_number: Sequelize.STRING(100),
    passport_issued_date: Sequelize.DATE,
    passport_expiry_date: Sequelize.DATE,
   middle_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
        rent_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
     joined_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      bookings: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      license_issued_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      license_expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      driving_license_photos: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      reviews: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      new: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    new_company: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    joined_date: {
        type: Sequelize.DATE,
        allowNull: true
    },
    type: Sequelize.INTEGER(1),
    version: Sequelize.STRING(50),
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, { timestamps: false });

module.exports = Users;
