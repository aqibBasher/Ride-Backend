'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserReviews', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      description: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      rating: {
        type: Sequelize.DECIMAL(10, 1),
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
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      booking_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserReviews');
  }
};
