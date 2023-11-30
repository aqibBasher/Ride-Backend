'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return await queryInterface.dropTable('Branches'); 
  },

  async down (queryInterface, Sequelize) {
  }
};
