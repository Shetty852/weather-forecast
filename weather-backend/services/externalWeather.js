// services/externalWeather.js
const axios = require('axios');
const { weatherCodeToText } = require('../utils/weatherCode');

async function geocodeByName(name) {
  const url = 'https://geocoding-api.open-meteo.com/v1/search';
  const tryFetch = async (q) => {
    const params = { name: q, count: 5, language: 'en', format: 'json' };
    const { data } = await axios.get(url, { params });
    if (!data || !data.results || data.results.length === 0) return null;
    const r = data.results[0];
    return { latitude: r.latitude, longitude: r.longitude, name: r.name };
  };
  const primary = await tryFetch(name);
  if (primary) return primary;
  const trimmed = String(name).trim();
  if (trimmed.length > 3) {
    const alt = await tryFetch(trimmed.slice(0, -1));
    if (alt) return alt;
  }
  return null;
}

async function fetchOpenMeteoForecast({ latitude, longitude, date }) {
  const url = 'https://api.open-meteo.com/v1/forecast';
  const params = {
    latitude,
    longitude,
    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,weathercode',
    start_date: date,
    end_date: date,
    timezone: 'UTC',
  };
  const { data } = await axios.get(url, { params });
  const hourly = [];
  if (data && data.hourly && Array.isArray(data.hourly.time)) {
    const times = data.hourly.time;
    const temps = data.hourly.temperature_2m || [];
    const hums = data.hourly.relative_humidity_2m || [];
    const winds = data.hourly.wind_speed_10m || [];
    const uvs = data.hourly.uv_index || [];
    const codes = data.hourly.weathercode || [];
    for (let i = 0; i < times.length; i++) {
      const t = times[i];
      const hour = new Date(t).getUTCHours();
      hourly.push({
        time: new Date(t).toISOString(),
        hour,
        tempC: temps[i] ?? null,
        temp_c: temps[i] ?? null,
        condition: weatherCodeToText(codes[i]),
        humidity: hums[i] ?? null,
        windKph: winds[i] != null ? Math.round(winds[i] * 3.6 * 10) / 10 : null, // m/s to kph if needed, Open-Meteo uses km/h by default; leave as-is
        wind_kph: winds[i] ?? null,
        uv: uvs[i] ?? null,
      });
    }
  }
  return hourly;
}

module.exports = { geocodeByName, fetchOpenMeteoForecast };
