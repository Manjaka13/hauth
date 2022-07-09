const {
    success,
    failure,
    isValidEmail,
    isValidPassword,
    isValidAppName,
    removeProtectedFields
} = require("../helpers/utils");
const { masterEmail } = require("../helpers/const");
const database = require("../services/mongoose");
const jwt = require("../services/jwt");
const Account = require("../services/account")(database, jwt);

/*
    Controllers and checks for account module
*/

const accountController = {
    // Creates new account
    create: (req, res) => {
        const account = req.body;
        const type = ["Master", "Admin", "User"];
        try {
            if (!account || Object.keys(account).length === 0)
                throw "Please provide account information";
            else if (!isValidEmail(account.email))
                throw "Email is invalid";
            else if (!isValidPassword(account.password))
                throw "Insufficient password strength";
            else if (!isValidAppName(account.app))
                throw "App name is invalid";
            delete account.id;
            delete account.__id;
            delete account.__v;
            delete account.createdAt;
            delete account.updatedAt;
            delete account.confirmationId;
            account.email = account.email.toLowerCase();
            account.level = 2;
            account.banned = false;
            if (account.email === masterEmail)
                account.level = 0;
            else if (res.locals.admin)
                account.level = 1;
            Account.create(account)
                .then(removeProtectedFields)
                .then(() => res.json((success(`${type[account.level]} account created`))))
                .catch(err => res.json(failure(err)));
        } catch (err) {
            res.json(failure(err));
        }
    },

    // Creates new admin account
    createAdmin: (req, res) => {
        res.locals.admin = true;
        accountController.create(req, res);
    },

    // Get list of admin in provided app
    getAdminList: (req, res) => {
        const { app } = req.body;
        if (!app)
            res.json(failure("Please provide app name"));
        else
            Account.getAdminList(app)
                .then((accountList) => accountList.map(removeProtectedFields))
                .then((accountList) => res.json(success("Account list", accountList)))
                .catch(err => res.json(failure(err)));
    },

    // Logs user in
    login: (req, res) => {
        const { email, password, app } = req.body;
        try {
            if (!isValidEmail(email))
                throw "Email is invalid";
            else if (!isValidPassword(password))
                throw "Insufficient password strength";
            else if (!isValidAppName(app))
                throw "App name is invalid";
            Account.login({ email, password, app })
                .then((account) => res.json(success("Logged in successfully", account)))
                .catch(err => res.json(failure(err)));
        } catch (err) {
            res.json(failure(err));
        }
    },

    // Confirms account
    confirm: (req, res) => {
        const { confirmationId, app } = req.body;
        if (!isValidAppName(app))
            res.json(failure("App name is invalid"));
        else if (!confirmationId)
            res.json(failure("Please provide the confirmation id"));
        else
            Account.confirm(app, confirmationId)
                .then(() => res.json(success("Account confirmed")))
                .catch(err => res.json(failure(err)));
    },

    // Verifies incoming token
    verify: (req, res) => {
        if (res.locals.account)
            res.json(success("User logged in", res.locals.account));
        else
            res.json(failure("User not logged in"));
    }
};

module.exports = accountController;