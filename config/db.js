// backend/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

// If DATABASE_URL exists → use it (Render)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Local development fallback
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres",
      logging: false,
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected");
    await sequelize.sync({ alter: true });
    console.log("✅ Models synchronized");
  } catch (error) {
    console.error("❌ Database error:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
