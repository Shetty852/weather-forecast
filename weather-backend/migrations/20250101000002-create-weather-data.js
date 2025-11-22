// migrations/20250101000002-create-weather-data.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('weather_data', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      locationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hour: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tempC: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      condition: {
        type: Sequelize.STRING,
        allowNull: true
      },
      humidity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      windKph: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      uv: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add unique constraint on locationId, date, hour
    await queryInterface.addIndex('weather_data', ['locationId', 'date', 'hour'], {
      unique: true,
      name: 'unique_location_date_hour'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('weather_data');
  }
};
