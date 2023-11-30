const Sequelize = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize(
//     process.env.DATABASE_NAME,
//     process.env.DATABASE_USER,
//     process.env.DATABASE_PASSWORD, {
//     host: process.env.DATABASE_HOST,
//     dialect:'mysql',
// });
const sequelize = new Sequelize('xride', 'app', 'xRideApp@123;', {
    host: '34.168.232.130',
    dialect: 'mysql',
    pool: {
      max: 90, // Maximum number of connections in the pool
      min: 0, // Minimum number of connections in the pool
      acquire: 30000, // Maximum time (in milliseconds) to wait for a connection
      idle: 10000, // Maximum time (in milliseconds) that a connection can be idle
    },
  });

  // Test the database connection
sequelize
.authenticate()
.then(async () => {
  // creating all tables if they don't exist
    // await sequelize.sync();
    console.log('Connection has been established successfully.');
})
.catch((err) => {
  console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
global.sequelize = sequelize;