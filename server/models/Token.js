const Sequelize = require('sequelize')
const sequelize = require('../database/connection')

const Token = sequelize.define('Token',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id:{
        type: Sequelize.STRING,
        allowNull:false
    },
    token:{
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
    }
},{ timestamps: false })

module.exports = Token