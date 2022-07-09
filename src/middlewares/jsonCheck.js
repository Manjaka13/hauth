const { failure } = require("../services/response");

// Handle JSON errors properly
const jsonCheck = (err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && "body" in err)
		res.json(failure(err.message));
	else next();
};

module.exports = jsonCheck;
