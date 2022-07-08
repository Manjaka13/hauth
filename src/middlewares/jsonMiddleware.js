const { failure } = require("../helpers/utils");

// Handle JSON errors properly
const jsonMiddleware = (err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && "body" in err)
		res.json(failure(err.message));
	else next();
};

module.exports = jsonMiddleware;
