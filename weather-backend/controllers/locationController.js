// controllers/locationController.js
const { Location } = require('../models');
const Joi = require('joi');

/**
 * POST /api/locations
 * Create a new location
 */
async function createLocation(req, res, next) {
  try {
    // Validate request body
    const schema = Joi.object({
      name: Joi.string().required(),
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional(),
      altitude: Joi.number().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation failed',
        details: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
      });
    }

    // Check if location with same name already exists
    const existing = await Location.findOne({
      where: { name: value.name }
    });

    if (existing) {
      return res.status(409).json({
        error: true,
        message: 'Location with this name already exists',
        location: existing
      });
    }

    // If latitude/longitude are missing, attempt geocoding
    if ((value.latitude == null || value.longitude == null) && process.env.AUTO_GEOCODE !== 'false') {
      try {
        const { geocodeByName } = require('../services/externalWeather');
        const geo = await geocodeByName(value.name);
        if (geo) {
          if (value.latitude == null) value.latitude = geo.latitude;
          if (value.longitude == null) value.longitude = geo.longitude;
        }
      } catch (e) {
        // Silently ignore geocode errors to not block creation
      }
    }

    const location = await Location.create(value);

    res.status(201).json({
      message: 'Location created successfully',
      location: {
        id: location.id,
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        altitude: location.altitude,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/locations/:id
 * Get location by ID
 */
async function getLocationById(req, res, next) {
  try {
    const { id } = req.params;

    const location = await Location.findByPk(id);

    if (!location) {
      return res.status(404).json({
        error: true,
        message: 'Location not found'
      });
    }

    res.json({
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      altitude: location.altitude,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/locations
 * Get all locations
 */
async function getAllLocations(req, res, next) {
  try {
    const locations = await Location.findAll({
      order: [['name', 'ASC']]
    });

    res.json(locations);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createLocation,
  getLocationById,
  getAllLocations
};
