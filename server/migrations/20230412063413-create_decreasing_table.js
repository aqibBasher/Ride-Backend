'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Decreasings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      day: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      car_categories_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'CarCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Decreasings');
  }
};
