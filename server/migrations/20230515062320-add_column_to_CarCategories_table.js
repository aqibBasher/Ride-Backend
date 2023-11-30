'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('CarCategories', 'final_rate', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('CarCategories', 'percent', {
      type: Sequelize.INTEGER
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('CarCategories', 'final_rate');
    await queryInterface.removeColumn('CarCategories', 'percent');
  }
};
