'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update the final_rate column type
    await queryInterface.changeColumn('CarCategories', 'final_rate', {
      type: Sequelize.DOUBLE(10, 2),
    });

    // Delete the weekend_rate column
    await queryInterface.removeColumn('CarCategories', 'weekend_rate');
  },


  async down(queryInterface, Sequelize) {
    // Recreate the weekend_rate column
    await queryInterface.addColumn('CarCategories', 'weekend_rate', {
      type: Sequelize.DOUBLE(10, 2),
    });

    // Restore the final_rate column type
    await queryInterface.changeColumn('CarCategories', 'final_rate', {
      type: Sequelize.INTEGER,
    });
  }
};
