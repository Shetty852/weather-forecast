// routes/forecast.js
const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');

/**
 * GET /api/forecast?location=<nameOrId>&date=YYYY-MM-DD
 * Get weather forecast for a location and date
 */
router.get('/', forecastController.getForecast);

module.exports = router;
