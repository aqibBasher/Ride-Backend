'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cars', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      make: Sequelize.STRING(50),
      model: Sequelize.STRING(300),
      year: Sequelize.INTEGER(11),
      bags: Sequelize.INTEGER,
      rate_per_day: Sequelize.DECIMAL(10, 2),
      currency: Sequelize.STRING,
      deposit_fee: Sequelize.DECIMAL(10, 2),
      deposit_currency: Sequelize.STRING,
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      color_name: Sequelize.STRING,
      plate_number: Sequelize.INTEGER,
      vin_number: Sequelize.STRING,
      engine_number: Sequelize.STRING,
      photos: Sequelize.JSON,
      damage_points: Sequelize.JSON,
      verified1: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      verified2: {
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
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      viewed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      viewedAdmin: {
        type: Sequelize.BOOLEAN,
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
      },
      car_rental_id: {
        type: Sequelize.STRING,
        references: {
          model: 'CarRentals',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      car_categories_id: {
        type: Sequelize.STRING,
        references: {
          model: 'CarCategories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cars');
  }
};
