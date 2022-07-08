const Auth = require("../interfaces/authInterface");
const { success, failure } = require("../helpers/utils");
const { isValidEmail } = require("../helpers/utils");

/*
    Controller for authentication module
*/

const authController = {
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
                Auth.login(email.toLowerCase(), password, app.toLowerCase())
                    .then((user) => {
                        res.json(success("User logged in", user));
                    })
                    .catch(err => res.json(failure(err)));
        }
    },

    // Verifies token
    verify: (req, res) => {
        const token = req.headers["authorization"]?.replace("Bearer ", "") || req.body.token;
        Auth.verifyToken(token)
            .then((user) => res.json(success("User logged in", user)))
            .catch(err => res.json(failure(err)));
    }
};

module.exports = authController;