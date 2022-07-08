const { failure } = require("../helpers/utils");
const { verify } = require("../interfaces/userInterface");
const database = require("../interfaces/mongooseInterface");

// Validates token to user object
const authMiddleware = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token)
        token = token.replace("Bearer ", "");
    verify(token)
        .then((user) => {
            res.locals.user = user;
        })
        .catch(() => {
            res.locals.user = undefined;
        })
        .finally(() => next());
};

// Protects routes from people that aren't logged in
const isLoggedIn = (req, res, next) => {
    const user = res.locals.user;
    if (user && user?.id)
        database.findUserById(user.id)
            .then((user) => {
                if (user.status != 1)
                    throw "This account isn't active";
                else
                    next();
            })
            .catch(err => res.json(failure(err)));
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

// Protects routes from unconfirmed accounts
const isConfirmed = (req, res, next) => {
    if (res.locals.user.status === 0)
        next();
    else
        res.json(failure("Please confirm your account first"));
};

module.exports = {
    authMiddleware,
    isLoggedIn,
    isMaster,
    isConfirmed
};
