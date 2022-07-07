const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { isValidEmail, compare } = require("../utils");
const { tokenSecret, refreshSecret } = require("../helpers/const");

/*
    Interfaces for authentication
*/

const authInterface = {
    login: (email, password, app) => new Promise((resolve, reject) => {
        if (!isValidEmail(email))
            reject("Please provide a valid email");
        else if (typeof password != "string")
            reject("Please provide a valid password");
        else if (typeof app != "string")
            reject("Please provide a valid app name");
        else
            User.findOne({
                email: email.toLowerCase(),
                app: app.toLowerCase()
            })
                .then((user) => {
                    if (!user)
                        throw "Invalid credentials";
                    else
                        compare(password, user.password)
                            .then((same) => {
                                if (!same)
                                    throw "Invalid password";
                                else {
                                    const formatedUser = {
                                        ...user._doc,
                                        password: undefined,
                                    };
                                    resolve({
                                        ...formatedUser,
                                        token: jwt.sign({ ...formatedUser }, tokenSecret, { expiresIn: "1h" })
                                    });
                                }
                            })
                            .catch(err => reject(err));
                })
                .catch((err) => reject(err));
    }),
    // Verifies token validity
    verifyToken: (token) => new Promise((resolve, reject) => {
        jwt.verify(token, tokenSecret, (err, user) => {
            if (err)
                reject("Please login first.");
            else
                resolve(user);
        });
    })
};

module.exports = authInterface;