// config/database.js
// Optimized for Aiven MySQL cloud database (with optional CA certificate)
require('dotenv').config();
const fs = require('fs');
const path = require('path');

function buildSslOptions() {
  // If a CA file path is provided, use it
  const caPath = process.env.DB_SSL_CA_PATH
    ? path.resolve(process.cwd(), process.env.DB_SSL_CA_PATH)
    : null;
  try {
    if (caPath && fs.existsSync(caPath)) {
      return {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(caPath, 'utf8'),
      };
    }
  } catch (e) {
    // fall through to other strategies
  }

  // Or if a base64-encoded CA is provided, decode and use it
  if (process.env.DB_SSL_CA_B64) {
    try {
      const ca = Buffer.from(process.env.DB_SSL_CA_B64, 'base64').toString('utf8');
      if (ca && ca.includes('BEGIN CERTIFICATE')) {
        return {
          require: true,
          rejectUnauthorized: true,
          ca,
        };
      }
    } catch (e) {}
  }

  // Fallback: require SSL but don't verify (works on Aiven, less strict)
  return {
    require: true,
    rejectUnauthorized: false,
  };
}

const config = {
  development: {
    username: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'defaultdb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: console.log, // Enable logging in development
    dialectOptions: {
      ssl: buildSslOptions(),
      connectTimeout: 60000 // 60 seconds for Aiven cloud connection
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST || 'defaultdb_test',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: buildSslOptions(),
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: buildSslOptions(),
      connectTimeout: 60000
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 60000,
      idle: 10000
    }
  }
};

module.exports = config;
