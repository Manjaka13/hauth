const { failure } = require("../helpers/utils");

// Handles 404 errors
const notFoundCheck = (req, res) => res.json(failure("Invalid route"));

module.exports = notFoundCheck;
