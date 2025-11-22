// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

// Import models
const Location = require('./location')(sequelize);
const WeatherData = require('./weatherdata')(sequelize);
const Favorite = require('./favorite')(sequelize);

// Define associations
Location.hasMany(WeatherData, { foreignKey: 'locationId', as: 'weatherData' });
WeatherData.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });

Location.hasMany(Favorite, { foreignKey: 'locationId', as: 'favorites' });
Favorite.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });

module.exports = {
  sequelize,
  Location,
  WeatherData,
  Favorite
};
