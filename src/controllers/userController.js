const { success, failure, isValidEmail } = require("../helpers/utils");
const User = require("../interfaces/userInterface");
const { master } = require("../helpers/const");

/*
    Controllers for user module
*/

const userController = {
    // Creates new user
    create: (req, res) => {
        const user = req.body;
        let level = res.locals.admin ? 1 : 2;
        if (user.email) {
            user.email = user.email.toLowerCase();
            if (user.email === master)
                level = 0;
        }
        if (user.app)
            user.app = user.app.toLowerCase();
        User.create(user, level)
            .then((newUser) => res.json(success((level === 0 ? "Master" : level === 1 ? "Admin" : "User") + " account created", newUser)))
            .catch(err => res.json(failure(err)));
    },

    // Creates admin account
    createAdmin: (req, res) => {
        res.locals.admin = true;
        userController.create(req, res);
    },

    // Gets user list
    getAll: (req, res) => {
        User.getAll(res.locals.user.app)
            .then((accountList) => res.json(success("User list", accountList)))
            .catch(err => res.json(failure(err)));
    },

    // Updates user data
    update(req, res) {
        const user = req.body;
        if (user.email || user.level || user.app || user.status)
            res.json(failure("Some fields are immutable and could not be updated"));
        else
            User.update(res.locals.user.id, user)
                .then(() => res.json(success("User information updated")))
                .catch(err => res.json(failure(err)));
    },

    // Deletes user
    delete(req, res) {
        const { id } = req.params;
        const app = res.locals.user.app;
        if (id === res.locals.user.id)
            res.json(failure("Unable to self delete :)"));
        else
            User.delete(id, app)
                .then(() => res.json(success("User deleted")))
                .catch(err => res.json(failure(err)));
    },

    // Confirms user account
    confirm: (req, res) => {
        const { id } = req.params;
        const { confirmationId, app, password } = req.body;
        if (!id)
            res.json(failure("Please provide valid id"));
        else if (!app)
            res.json(failure("Please provide a valid app name"));
        else if (!password)
            res.json(failure("Please provide the password used to create this account"));
        else
            User.confirm(id, app, password, confirmationId)
                .then(() => res.json(success("User account confirmed")))
                .catch(err => res.json(failure(err)));
    },

    // Logs user in
    login: (req, res) => {
        const { email, password, app } = req.body;
        const { user } = res.locals;
        if (user)
            res.json(failure("You are already logged in"));
        else {
            if (!isValidEmail(email))
                res.json(failure("Please provide a valid email"));
            else if (typeof password != "string")
                res.json(failure("Please provide a valid password"));
            else if (typeof app != "string")
                res.json(failure("Please provide a valid app name"));
            else
                User.login(email.toLowerCase(), password, app.toLowerCase())
                    .then((user) => res.json(success("User logged in", user)))
                    .catch(err => res.json(failure(err)));
        }
    },

    // Verifies token
    verify: (req, res) => {
        const token = req.headers["authorization"]?.replace("Bearer ", "") || req.body.token;
        User.verify(token)
            .then((user) => res.json(success("User logged in", user)))
            .catch(err => res.json(failure(err)));
    },

    // Bans an account
    ban: (req, res) => {
        const { id } = req.params;
        if (!id)
            res.json(failure("Please provide an id to ban"));
        else if (id === res.locals.user.id)
            res.json(failure("Unable to self ban :)"));
        else
            User.ban(id)
                .then(() => res.json(success("User banned")))
                .catch(err => res.json(failure(err)));
    },

    // Unbans an account
    unban: (req, res) => {
        const { id } = req.params;
        if (!id)
            res.json(failure("Please provide an id to unban"));
        else if (id === res.locals.user.id)
            res.json(failure("Unable to self unban :)"));
        else
            User.unban(id)
                .then(() => res.json(success("User unbanned")))
                .catch(err => res.json(failure(err)));
    },

    // Gets admin list on an app
    getAdmin: (req, res) => {
        const { app } = req.body;
        if (!app)
            res.json(failure("Please provide app name"));
        else
            User.getAdmin(app)
                .then((accountList) => res.json(success("Admin list", accountList)))
                .catch(err => res.json(failure(err)));
    },
};

module.exports = userController;
