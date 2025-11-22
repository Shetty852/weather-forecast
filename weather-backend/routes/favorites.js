// routes/favorites.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

/**
 * GET /api/favorites
 * Get all favorites
 */
router.get('/', favoriteController.getFavorites);

/**
 * POST /api/favorites
 * Add location to favorites
 */
router.post('/', favoriteController.addFavorite);

module.exports = router;
