'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Administrations', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(300),
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Administrations');
  }
};
