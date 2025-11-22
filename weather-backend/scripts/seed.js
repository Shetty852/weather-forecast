// scripts/seed.js
require('dotenv').config();
const { sequelize, Location, WeatherData, Favorite } = require('../models');

const conditions = ['clear', 'cloudy', 'rain'];

// Generate realistic temperature curve for a day
function getTempForHour(hour) {
  // Simplified sine wave: min temp at 5am (~22°C), max at 2pm (~32°C)
  const minTemp = 22;
  const maxTemp = 32;
  const range = maxTemp - minTemp;
  // Peak at hour 14 (2pm)
  const normalized = Math.sin(((hour - 5) / 24) * 2 * Math.PI);
  return Math.round((minTemp + (range / 2) * (1 + normalized)) * 10) / 10;
}

async function seed() {
  try {
    console.log('🌱 Starting seed process...');

    // Sync database (use with caution - will drop existing tables in dev)
    await sequelize.sync({ force: false });
    console.log('✅ Database synced');

    // Clear existing data (optional - comment out if you want to preserve data)
    await Favorite.destroy({ where: {}, truncate: true });
    await WeatherData.destroy({ where: {}, truncate: true });
    await Location.destroy({ where: {}, truncate: true });
    console.log('🧹 Cleared existing data');

    // Create locations
    const mumbai = await Location.create({
      name: 'Mumbai',
      latitude: 19.0760,
      longitude: 72.8777,
      altitude: 14
    });

    const bengaluru = await Location.create({
      name: 'Bengaluru',
      latitude: 12.9716,
      longitude: 77.5946,
      altitude: 920
    });

    console.log('📍 Created locations: Mumbai, Bengaluru');

    // Sample date
    const sampleDate = '2025-11-19';

    // Create 24 hourly weather data for Mumbai
    const mumbaiWeatherData = [];
    for (let hour = 0; hour < 24; hour++) {
      mumbaiWeatherData.push({
        locationId: mumbai.id,
        date: sampleDate,
        hour: hour,
        tempC: getTempForHour(hour),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: 60 + Math.floor(Math.random() * 20),
        windKph: 10 + Math.floor(Math.random() * 15),
        uv: hour >= 6 && hour <= 18 ? Math.floor(Math.random() * 8) + 1 : 0
      });
    }
    await WeatherData.bulkCreate(mumbaiWeatherData);
    console.log(`☀️  Created 24 hourly weather records for Mumbai (${sampleDate})`);

    // Create 24 hourly weather data for Bengaluru
    const bengaluruWeatherData = [];
    for (let hour = 0; hour < 24; hour++) {
      bengaluruWeatherData.push({
        locationId: bengaluru.id,
        date: sampleDate,
        hour: hour,
        tempC: getTempForHour(hour) - 3, // Slightly cooler
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: 50 + Math.floor(Math.random() * 25),
        windKph: 8 + Math.floor(Math.random() * 12),
        uv: hour >= 6 && hour <= 18 ? Math.floor(Math.random() * 7) + 1 : 0
      });
    }
    await WeatherData.bulkCreate(bengaluruWeatherData);
    console.log(`  Created 24 hourly weather records for Bengaluru (${sampleDate})`);

    // Create a favorite
    await Favorite.create({
      locationId: mumbai.id
    });
    console.log('Created favorite for Mumbai');

    console.log(' Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Seed failed:', error);
    process.exit(1);
  }
}

seed();
