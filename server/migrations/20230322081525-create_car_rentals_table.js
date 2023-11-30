'use strict';
const cuid = require('cuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CarRentals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: () => cuid()
      },
      company_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      manager_name: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      manager_phone_number: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      insurance_doc: Sequelize.STRING(400),
      company_photo: {
        type: Sequelize.STRING(400),
        allowNull: false
      },
      signature: Sequelize.STRING(400),
      stamp: Sequelize.STRING(400),
      second_page_agreement: {
        type: Sequelize.STRING(400),
        allowNull: false
      },
      api_url: Sequelize.STRING(400),
      api_username: Sequelize.STRING(100),
      api_password: Sequelize.STRING(255),
      api_key: Sequelize.STRING(255),
      website_url: Sequelize.STRING(255),
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
      airport_delivery_charge: Sequelize.STRING,
      airport_delivery_charge_free: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      custom_delivery_charge: {
        type: Sequelize.STRING,
        defaultValue: false,
      },
      custom_delivery_charge_free: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      telephone: {
        type: Sequelize.STRING,
        defaultValue: false,
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CarRentals');
  }
};
