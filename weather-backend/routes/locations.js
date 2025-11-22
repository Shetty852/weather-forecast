// routes/locations.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

/**
 * POST /api/locations
 * Create a new location
 */
router.post('/', locationController.createLocation);

/**
 * POST /api/locations/quick
 * Quick create with just name; auto geocode lat/long
 */
router.post('/quick', async (req, res, next) => {
	if (!req.body || !req.body.name) {
		return res.status(400).json({ error: true, message: 'Name is required' });
	}
	// Delegate to createLocation by passing name only
	req.body = { name: req.body.name }; // sanitize other fields out
	return locationController.createLocation(req, res, next);
});

// Note: Alias for singular form is handled at the API gateway or client; router is mounted at /api/locations

/**
 * GET /api/locations
 * Get all locations
 */
router.get('/', locationController.getAllLocations);

/**
 * GET /api/locations/:id
 * Get location by ID
 */
router.get('/:id', locationController.getLocationById);

module.exports = router;
