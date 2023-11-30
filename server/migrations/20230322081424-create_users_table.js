'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
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
      first_name: {
        type: Sequelize.STRING(30),
      },
      last_name: {
        type: Sequelize.STRING(30),
      },
      date_of_birth: {
        type: Sequelize.DATE,
      },
      age: {
        type: Sequelize.INTEGER(11),
      },
      profile_photo: {
        type: Sequelize.STRING(300),
      },
      phone_number: {
        type: Sequelize.STRING(30),
      },
      country_code: {
        type: Sequelize.STRING(30),
      },
      permenant_address: {
        type: Sequelize.STRING(200),
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      driving_license_doc: {
        type: Sequelize.STRING(400),
        allowNull: false
      },
      passport_doc: {
        type: Sequelize.STRING(400),
      },
      id_doc: {
        type: Sequelize.STRING(400),
      },
      rent_state: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      nationality: {
        type: Sequelize.STRING(100),
      },
      father_name: {
        type: Sequelize.STRING(100),
      },
      mother_name: {
        type: Sequelize.STRING(100),
      },
      driving_license_number: {
        type: Sequelize.STRING(100),
      },
      passport_number: {
        type: Sequelize.STRING(100),
      },
      id_number: {
        type: Sequelize.STRING(100),
      },
      passport_issued_date: {
        type: Sequelize.DATE,
      },
      passport_expiry_date: Sequelize.DATE,
      signature: Sequelize.STRING(400),
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
    await queryInterface.dropTable('Users');
  }
};
