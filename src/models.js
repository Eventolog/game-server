require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// Define the ranking_item model
const RankingItem = sequelize.define('ranking_item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time_seconds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: false, // if you don’t want createdAt/updatedAt fields
});

module.exports = {
  sequelize,
  RankingItem,
};
