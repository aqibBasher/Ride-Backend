'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      placed_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pickup_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dropoff_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pickup_location: {
        type: Sequelize.JSON,
        allowNull: false
      },
      dropoff_location: {
        type: Sequelize.JSON,
        allowNull: false
      },
      pickup_address: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      dropoff_address: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      qrcode_state: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      booking_state: {
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
      canceled_date: Sequelize.DATE,
      cancelation_reason: Sequelize.STRING,
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      car_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Cars',
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
    await queryInterface.dropTable('Bookings');
  }
};
