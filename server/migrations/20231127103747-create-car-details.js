'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CarDetails', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
        
      },
      car_make: {
        type: Sequelize.STRING
      },
      car_model: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      transmission: {
        type: Sequelize.STRING
      },
      car_doors: {
        type: Sequelize.INTEGER
      },
      car_seats: {
        type: Sequelize.INTEGER
      },
      available: {
        type: Sequelize.BOOLEAN
      },
      car_rental_id: {
        type: Sequelize.INTEGER
      },
      car_category_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CarDetails');
  }
};