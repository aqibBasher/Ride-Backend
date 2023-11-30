'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('CarCategories', 'weekday_rate', 'original_rate');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('CarCategories', 'original_rate', 'weekday_rate');
  }
};
