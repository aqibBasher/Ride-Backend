'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CarCategories', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      weekday_rate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      weekend_rate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      live: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      seats: Sequelize.INTEGER,
      doors: Sequelize.STRING,
      transmission: Sequelize.STRING,
      features: Sequelize.JSON,
      km: Sequelize.STRING,
      unlimitedKm: Sequelize.BOOLEAN,
      deposit_fee: Sequelize.STRING,
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      cars: Sequelize.INTEGER,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      car_rental_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'CarRentals',
          key: 'id'
        }
      },
      categories_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id'
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CarCategories');
  }
};
