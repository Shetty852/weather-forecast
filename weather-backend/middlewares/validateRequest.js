// middlewares/validateRequest.js
const Joi = require('joi');

/**
 * Middleware factory for Joi validation
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
function validateRequest(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: true,
        message: 'Validation failed',
        details: details
      });
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };
}

module.exports = validateRequest;
