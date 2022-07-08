const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { compare } = require("../helpers/utils");
const { tokenSecret } = require("../helpers/const");

/*
    Interfaces for authentication
*/

const authInterface = {
    // Logs user in
    login: (email, password, app) => new Promise((resolve, reject) => {
        User.findOne({ email, app })
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
                                    id: user.id,
                                    _id: undefined,
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
    }),
};

module.exports = authInterface;