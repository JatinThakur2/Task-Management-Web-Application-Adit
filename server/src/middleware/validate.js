const { validationResult } = require('express-validator');

// Runs after a set of express-validator checks and turns any failures into a
// 422 response. Keeps the controllers free of validation boilerplate.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { validate };
