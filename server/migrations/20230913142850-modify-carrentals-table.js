'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   // Remove columns
   await queryInterface.removeColumn('CarRentals', 'manager_name');
   await queryInterface.removeColumn('CarRentals', 'manager_phone_number');
   await queryInterface.removeColumn('CarRentals', 'insurance_doc');
   await queryInterface.removeColumn('CarRentals', 'signature');
   await queryInterface.removeColumn('CarRentals', 'second_page_agreement');
   await queryInterface.removeColumn('CarRentals', 'api_username');
   await queryInterface.removeColumn('CarRentals', 'api_password');
   await queryInterface.removeColumn('CarRentals', 'api_url');
   await queryInterface.removeColumn('CarRentals', 'website_url');
   await queryInterface.removeColumn('CarRentals', 'airport_delivery_charge');
   await queryInterface.removeColumn('CarRentals', 'airport_delivery_charge_free');
   await queryInterface.removeColumn('CarRentals', 'custom_delivery_charge');
   await queryInterface.removeColumn('CarRentals', 'custom_delivery_charge_free');
   await queryInterface.removeColumn('CarRentals', 'telephone');

   // Add columns
   await queryInterface.addColumn('CarRentals', 'closing_time', {
     type: Sequelize.STRING(50),
   });
   await queryInterface.addColumn('CarRentals', 'delivery_charge', {
    type: Sequelize.JSON, 
   });
   await queryInterface.addColumn('CarRentals', 'documentation_url', {
     type: Sequelize.STRING(400),
   });
   await queryInterface.addColumn('CarRentals', 'landline_number', {
     type: Sequelize.STRING(50), 
   });
   await queryInterface.addColumn('CarRentals', 'location', {
     type: Sequelize.JSON, 
   });
   await queryInterface.addColumn('CarRentals', 'opening_days', {
     type: Sequelize.JSON, 
   });
   await queryInterface.addColumn('CarRentals', 'opening_time', {
     type: Sequelize.STRING(50), 
   });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
