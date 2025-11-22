// models/weatherdata.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WeatherData = sequelize.define('WeatherData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 23
      }
    },
    tempC: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    humidity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    windKph: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    uv: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'weather_data',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['locationId', 'date', 'hour']
      }
    ]
  });

  return WeatherData;
};
