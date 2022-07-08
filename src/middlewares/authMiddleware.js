const { failure } = require("../helpers/utils");
const { verifyToken } = require("../interfaces/authInterface");

// Validates token to user object
const authMiddleware = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token)
        token = token.replace("Bearer ", "");
    verifyToken(token)
        .then((user) => {
            res.locals.user = { ...user, id: user._id, _id: undefined };
        })
        .catch(() => {
            res.locals.user = undefined;
        })
        .finally(() => next());
};

// Protects routes from people that aren't logged in
const isLoggedIn = (req, res, next) => {
    if (res.locals.user)
        next();
    else
        res.json(failure("Please login first"));
};

// Protects routes from people that aren't MASTER
const isMaster = (req, res, next) => {
    if (res.locals.user.level === 0)
        next();
    else
        res.json(failure("You need to be MASTER to access this route"));
};

module.exports = {
    authMiddleware,
    isLoggedIn,
    isMaster
};
