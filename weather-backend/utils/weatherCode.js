// utils/weatherCode.js
// Map Open-Meteo weather codes to human readable strings

const codeMap = {
  0: 'clear', // Clear sky
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'cloudy',
  45: 'fog',
  48: 'depositing rime fog',
  51: 'light drizzle',
  53: 'moderate drizzle',
  55: 'dense drizzle',
  56: 'freezing drizzle light',
  57: 'freezing drizzle dense',
  61: 'light rain',
  63: 'rain',
  65: 'heavy rain',
  66: 'freezing rain light',
  67: 'freezing rain heavy',
  71: 'light snow',
  73: 'snow',
  75: 'heavy snow',
  77: 'snow grains',
  80: 'rain showers light',
  81: 'rain showers',
  82: 'rain showers heavy',
  85: 'snow showers light',
  86: 'snow showers heavy',
  95: 'thunderstorm',
  96: 'thunderstorm hail light',
  99: 'thunderstorm hail heavy',
};

function weatherCodeToText(code) {
  if (code == null) return 'unknown';
  return codeMap[code] || 'unknown';
}

module.exports = { weatherCodeToText };
