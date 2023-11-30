'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      message: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      sender: {
        type: Sequelize.STRING,
        allowNull: false
      },
      seen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      online: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      room_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Rooms',
          key: 'id'
        }
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};
