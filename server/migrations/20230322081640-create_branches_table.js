'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Branches', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      car_rental_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'CarRentals',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      location: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      open_day: {
        type: Sequelize.JSON,
        allowNull: false
      },
      open_times: {
        type: Sequelize.JSON,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      country_code: {
        type: Sequelize.STRING(10),
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
    await queryInterface.dropTable('Branches');
  }
};
