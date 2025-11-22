// controllers/favoriteController.js
const { Favorite, Location } = require('../models');
const Joi = require('joi');

/**
 * GET /api/favorites
 * Get all favorites with location details
 */
async function getFavorites(req, res, next) {
  try {
    const favorites = await Favorite.findAll({
      include: [{
        model: Location,
        as: 'location',
        attributes: ['id', 'name', 'latitude', 'longitude', 'altitude']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(favorites);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/favorites
 * Add a location to favorites
 */
async function addFavorite(req, res, next) {
  try {
    // Validate request body
    const schema = Joi.object({
      locationId: Joi.number().integer().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation failed',
        details: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
      });
    }

    const { locationId } = value;

    // Check if location exists
    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({
        error: true,
        message: 'Location not found'
      });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      where: { locationId }
    });

    if (existing) {
      return res.status(200).json({
        message: 'Location is already in favorites',
        favorite: existing
      });
    }

    // Create favorite
    const favorite = await Favorite.create({ locationId });

    // Fetch with location details
    const favoriteWithLocation = await Favorite.findByPk(favorite.id, {
      include: [{
        model: Location,
        as: 'location',
        attributes: ['id', 'name', 'latitude', 'longitude', 'altitude']
      }]
    });

    res.status(201).json({
      message: 'Location added to favorites',
      favorite: favoriteWithLocation
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFavorites,
  addFavorite
};
