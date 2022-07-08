const { failure } = require("../helpers/utils");

// Handles 404 errors
const notfoundMiddleware = (req, res) => res.json(failure("Invalid route"));

module.exports = notfoundMiddleware;
