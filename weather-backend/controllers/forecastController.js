// controllers/forecastController.js
const forecastService = require('../services/forecastService');
const Joi = require('joi');

/**
 * GET /api/forecast?location=<nameOrId>&date=YYYY-MM-DD
 * Get weather forecast for a location and date
 */
async function getForecast(req, res, next) {
  try {
    // Validate query params
    const schema = Joi.object({
      location: Joi.alternatives().try(
        Joi.number().integer(),
        Joi.string()
      ).required(),
      date: Joi.date().iso().required()
    });

    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation failed',
        details: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
      });
    }

    const { location, date } = value;

    // Normalize date to YYYY-MM-DD even if an ISO string with time was provided
    const dateStr = new Date(date).toISOString().split('T')[0];

    // Optional source param: 'db' | 'external' | 'auto'
    // Default to 'db' in test to avoid external calls affecting tests
    const source = (req.query.source || process.env.WEATHER_SOURCE || (process.env.NODE_ENV === 'test' ? 'db' : 'auto')).toString();

    // Get forecast data from service
    const forecastData = await forecastService.getForecastData(location, dateStr, source);

    res.json(forecastData);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getForecast
};
