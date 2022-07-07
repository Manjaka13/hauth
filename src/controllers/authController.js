const { success, failure } = require("../utils");
const authInterface = require("../interfaces/authInterface");

/*
    Controller for authentication module
*/

const authController = {
    login: (req, res) => {
        const { email, password, app } = req.body;
        const { user } = res.locals;
        if (user)
            res.json(success("You are already logged in"));
        else
            authInterface.login(email, password, app)
                .then((user) => {
                    res.json(success("User logged in", user));
                })
                .catch(err => res.json(failure(err)));
    }
};

module.exports = authController;