// Turns express-validator results into one clear, consistent error response.
const { validationResult } = require('express-validator');

module.exports = function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const fields = {};
  for (const e of result.array()) {
    if (!fields[e.path]) fields[e.path] = e.msg; // first message per field
  }
  return res.status(400).json({
    error: 'Some fields need your attention. Please correct them and try again.',
    fields,
  });
};
