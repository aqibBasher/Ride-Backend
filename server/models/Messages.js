const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const Rooms = require('./Rooms');

const Messages = sequelize.define('Message', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    online: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    seen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
}, { timestamps: false });

Rooms.hasMany(Messages, { foreignKey: 'room_id' });
Messages.belongsTo(Rooms, { foreignKey: 'room_id' });

// remove online


module.exports = Messages;
