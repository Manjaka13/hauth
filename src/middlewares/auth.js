const database = require("../services/mongoose");
const { failure, removeProtectedFields } = require("../helpers/utils");
const Account = require("../services/account")(database);

/*
    Authentication middlewares
*/

module.exports = (jwt) => ({
    // Gets account from token
    getLoggedAccount: (req, res, next) => {
        let token = req.headers["authorization"];
        if (token)
            token = token.replace("Bearer ", "");
        jwt.verify(token)
            .then(Account.get)
            .then(removeProtectedFields)
            .then((account) => {
                res.locals.account = account;
            })
            .catch(() => {
                res.locals.account = null;
            })
            .finally(() => next())
    },

    // Checks if account were banned
    checkBannedAccount: (req, res, next) => {
        if (res.locals.account && res.locals.account.banned)
            res.json(failure("This account have been banned"));
        else
            next();
    },

    // User must be logged out to access next route
    mustBeLoggedOut: (req, res, next) => {
        if (res.locals.account)
            res.json(failure("Please logout first"));
        else
            next();
    },

    // User "should" be logged out for the next route
    shouldBeLoggedOut: (req, res, next) => {
        if (res.locals.account)
            res.json(failure("You are already connected"));
        else
            next();
    },

    // User must be logged in to access next route
    mustBeLoggedIn: (req, res, next) => {
        if (res.locals.account)
            next();
        else
            res.json(failure("Please login first"));
    },

    // Check if account were confirmed
    isConfirmed: (req, res, next) => {
        if (res.locals.account && !res.locals.account.confirmationId)
            next();
        else
            res.json(failure("Please confirm your account first"));
    }
});