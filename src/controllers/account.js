const { success, failure } = require("../services/response");
const validation = require("../services/validation");
const { masterEmail, accountType } = require("../helpers/const");
const jwt = require("../services/jwt");
const database = require("../services/mongoose");
const Account = require("../services/account")(database, jwt);

/*
    Controllers and checks for account module
*/

const accountController = {
    // Creates new account
    create: (req, res) => {
        const account = req.body;
        try {
            if (!account || Object.keys(account).length === 0)
                throw "Please provide account information";
            else if (!validation.email(account.email))
                throw "Email is invalid";
            else if (!validation.password(account.password))
                throw "Insufficient password strength";
            else if (!validation.name(account.app))
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
                .then((account) => res.json((success(`${accountType[account.level]} account created`, account))))
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
        try {
            if (!validation.name(app))
                throw "Please provide app name";

            Account.getAdminList(app)
                .then((list) => res.json(success("Admin account list", list)))
                .catch(err => res.json(failure(err)));
        } catch (err) {
            res.json(failure(err));
        }
    },

    // Logs user in
    login: (req, res) => {
        const { email, password, app } = req.body;
        try {
            if (!validation.email(email))
                throw "Email is invalid";
            else if (!validation.password(password))
                throw "Insufficient password strength";
            else if (!validation.name(app))
                throw "App name is invalid";

            Account.login(app, email, password)
                .then((account) => {
                    const { token } = account;
                    delete account.token;
                    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
                    // res.setHeader("Access-Control-Allow-Credentials", true);
                    // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: false
                    })
                        .json(success("Logged in successfully", account));
                })
                .catch(err => res.json(failure(err)));
        } catch (err) {
            res.json(failure(err));
        }
    },

    // Confirms account
    confirm: (req, res) => {
        const { confirmationId, password } = req.body;
        try {
            if (!confirmationId)
                throw "Please provide the confirmation id";
            else if (!validation.password(password))
                throw "Please provide a valid password";

            Account.confirm(confirmationId, password)
                .then(() => res.json(success("Account confirmed")))
                .catch(err => res.json(failure(err)));
        } catch (err) {
            res.json(failure(err));
        }
    },

    // Verifies incoming token
    verify: (req, res) => {
        if (res.locals.account)
            res.json(success("User logged in", res.locals.account));
        else
            res.json(failure("User not logged in"));
    },

    // Bans account
    ban: (req, res) => {
        const { app, email } = req.body;
        try {
            if (!validation.email(email))
                throw "Please provide a valid email";
            else if (!validation.name(app))
                throw "Please provide a valid app name";
            else if (email === res.locals.account.email && app === res.locals.account.app)
                throw "Can not self ban";

            Account.ban(app, email)
                .then(() => res.json(success("Account banned")))
                .catch(err => res.json(failure(err)));
        } catch (err) {
            res.json(failure(err));
        }
    },

    // Unbans account
    unban: (req, res) => {
        const { app, email } = req.body;
        try {
            if (!validation.email(email))
                throw "Please provide a valid email";
            else if (!validation.name(app))
                throw "Please provide a valid app name";
            else if (email === res.locals.account.email && app === res.locals.account.app)
                throw "Can not unban self";

            Account.unban(app, email)
                .then(() => res.json(success("Ban removed from account")))
                .catch(err => res.json(failure(err)));
        } catch (err) {
            res.json(failure(err));
        }
    },

    // Unbans account
    delete: (req, res) => {
        const { app, email } = req.body;
        try {
            if (!validation.email(email))
                throw "Please provide a valid email";
            else if (!validation.name(app))
                throw "Please provide a valid app name";
            else if (email === res.locals.account.email && app === res.locals.account.app)
                throw "Can not delete self";

            Account.delete(app, email)
                .then(() => res.json(success("Account deleted")))
                .catch(err => res.json(failure(err)));
        } catch (err) {
            res.json(failure(err));
        }
    },

    // Updates user data
    update(req, res) {
        const { app, email } = res.locals.account;
        const account = req.body;
        try {
            if (!validation.email(email) || !validation.name(app))
                throw "Please login";
            delete account.app;
            delete account.email;
            delete account.level;
            delete account.banned;
            delete account.confirmationId;

            Account.update(app, email, account)
                .then(() => res.json(success("Account information updated")))
                .catch(err => res.json(failure(err)));
        } catch (err) {
            res.json(failure(err));
        }
    },
};

module.exports = accountController;