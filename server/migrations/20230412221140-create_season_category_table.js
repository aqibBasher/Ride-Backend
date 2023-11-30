'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SeasonsCategories', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      season_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Seasons',
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
      season_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      in_season: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SeasonsCategories');
  }
};
