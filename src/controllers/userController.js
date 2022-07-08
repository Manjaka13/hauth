const { success, failure } = require("../utils");
const User = require("../interfaces/userInterface");

/*
    Controllers for user module
*/

const userController = {
    // Creates new user
    create: (req, res) => {
        const user = req.body;
        if (user.email)
            user.email = user.email.toLowerCase();
        if (user.app)
            user.app = user.app.toLowerCase();
        User.create(user)
            .then((newUser) => res.json(success("User created", newUser)))
            .catch(err => res.json(failure(err)));
    },

    // Gets user list
    get: (req, res) => {
        User.get(res.locals.user.app)
            .then((accountList) => res.json(success("User list", accountList)))
            .catch(err => res.json(failure(err)));
    },

    // Updates user data
    update(req, res) {
        const user = req.body;
        console.log(res.locals.user)
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
    }
};

module.exports = userController;
