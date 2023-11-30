const asyncHandler = require('express-async-handler');
const sequelize = require('../../database/connection');

const testConnection = asyncHandler(async (req, res) => {
    try {
      await sequelize.authenticate();
      res.status(200).json({ message: 'Database connection successful' });
    } catch (error) {
      res.status(500).json({ message: 'Unable to connect to the database', error: error.message });
    }
  })

module.exports = {testConnection}

