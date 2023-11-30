'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Decreasings', 'percent', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('Decreasings', 'old_rate', {
      type: Sequelize.INTEGER
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Decreasings', 'percent');
    await queryInterface.removeColumn('Decreasings', 'old_rate');
  }
};
