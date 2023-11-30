'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SupportContacts', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      description: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      solved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      submited_date: Sequelize.DATE,
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
      other: Sequelize.STRING,
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
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      car_rental_id: {
        type: Sequelize.STRING,
        references: {
          model: 'CarRentals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      booking_id: {
        type: Sequelize.STRING,
        references: {
          model: 'Bookings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SupportContacts');
  }
};
