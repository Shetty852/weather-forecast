// routes/index.js
const express = require('express');
const router = express.Router();

const forecastRoutes = require('./forecast');
const locationRoutes = require('./locations');
const favoriteRoutes = require('./favorites');

// Mount route modules
router.use('/forecast', forecastRoutes);
router.use('/locations', locationRoutes);
router.use('/favorites', favoriteRoutes);

module.exports = router;
