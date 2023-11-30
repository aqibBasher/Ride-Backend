// test/reviewsModel.test.js

const assert = require('assert'); // Using Node.js built-in assert module
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection'); // Update the path accordingly
const Reviews = require('../models/Reviews.js'); // Update the path accordingly

describe('Reviews Model', () => {
  it('should be defined', () => {
    assert.strictEqual(typeof Reviews, 'function');
  });

  it('should define the expected fields and data types', () => {
    const attributes = Reviews.init(sequelize);
    assert.deepStrictEqual(attributes, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      placed_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      car_rental_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });
  });
});
