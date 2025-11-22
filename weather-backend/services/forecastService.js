// services/forecastService.js
const { Location, WeatherData } = require('../models');
const { buildISOTime } = require('../utils/dateUtils');
const { Op } = require('sequelize');
const { geocodeByName, fetchOpenMeteoForecast } = require('./externalWeather');

/**
 * Resolve location by ID or name
 * @param {string|number} locationParam - Location ID or name
 * @returns {Promise<Object|null>}
 */
async function resolveLocation(locationParam) {
  // Check if numeric ID
  if (!isNaN(locationParam)) {
    return await Location.findByPk(parseInt(locationParam));
  }
  
  // Search by name (case-insensitive)
  const name = String(locationParam).trim();
  const pattern = `%${name}%`;
  let found = await Location.findOne({
    where: {
      name: {
        [Op.like]: pattern
      }
    }
  });
  // Simple fuzzy fallback: drop the last character to catch minor typos (e.g., "mumbaii" -> "mumbai")
  if (!found && name.length > 3) {
    const alt = `%${name.slice(0, -1)}%`;
    found = await Location.findOne({
      where: {
        name: {
          [Op.like]: alt
        }
      }
    });
  }
  return found;
}

/**
 * Fetch hourly forecast data for a location and date
 * @param {string|number} locationParam - Location ID or name
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {('auto'|'db'|'external')} source - where to fetch from
 * @returns {Promise<Object>}
 */
async function getForecastData(locationParam, date, source = (process.env.WEATHER_SOURCE || (process.env.NODE_ENV === 'test' ? 'db' : 'auto'))) {
  // Resolve location
  let location = await resolveLocation(locationParam);

  let hourly = [];

  const shouldTryDb = source === 'db' || source === 'auto';
  const shouldTryExternal = source === 'external' || source === 'auto';

  // If location wasn't found in DB and we're not allowed to try external,
  // fail fast with a clear error (preserves test expectations).
  if (!location && !shouldTryExternal) {
    const error = new Error('Location not found');
    error.statusCode = 404;
    throw error;
  }

  if (shouldTryDb && location) {
    const hourlyData = await WeatherData.findAll({
      where: { locationId: location.id, date },
      order: [['hour', 'ASC']]
    });
    if (hourlyData && hourlyData.length > 0) {
      hourly = hourlyData.map(h => ({
        time: buildISOTime(date, h.hour),
        hour: h.hour,
        tempC: h.tempC,
        temp_c: h.tempC,
        condition: h.condition,
        humidity: h.humidity,
        windKph: h.windKph,
        wind_kph: h.windKph,
        uv: h.uv,
      }));
    }
  }

  if (hourly.length === 0 && shouldTryExternal) {
    // If no DB location found and the param is a name, geocode
    let latitude = location?.latitude ? parseFloat(location.latitude) : null;
    let longitude = location?.longitude ? parseFloat(location.longitude) : null;
    let locName = location?.name;

    if ((!latitude || !longitude) && isNaN(locationParam)) {
      const geo = await geocodeByName(String(locationParam));
      if (geo) {
        latitude = geo.latitude;
        longitude = geo.longitude;
        if (!locName) locName = geo.name;
      }
    }

    if (latitude != null && longitude != null) {
      const extHourly = await fetchOpenMeteoForecast({ latitude, longitude, date });
      if (extHourly.length > 0) {
        hourly = extHourly;
        // If no DB location, synthesize minimal location object
        if (!location) {
          location = { id: null, name: locName || String(locationParam), latitude, longitude, altitude: null };
        }
      }
    }
  }

  if (hourly.length === 0) {
    // If we couldn't resolve a location at all and no external data, report not found.
    if (!location) {
      const error = new Error('Location not found');
      error.statusCode = 404;
      throw error;
    }
    const error = new Error('No forecast data available for this date');
    error.statusCode = 404;
    throw error;
  }

  return {
    date: date,
    location: {
      id: location.id,
      name: location.name,
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
      altitude: location.altitude ? parseFloat(location.altitude) : null
    },
    hourly: hourly
  };
}

module.exports = {
  resolveLocation,
  getForecastData
};
