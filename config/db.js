// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// ✅ Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

// ✅ Function to connect and sync models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized');
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
};

// ✅ Export both Sequelize instance and connect function
module.exports = { sequelize, connectDB };
