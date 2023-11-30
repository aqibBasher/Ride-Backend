'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Tokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull:false
      },
      token: {
        type:Sequelize.STRING,
        allowNull :false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        index: {
            expires: 30
        }
    },
    },{ timestamps: false });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Token')
  }
};
