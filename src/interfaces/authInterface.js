const jwt = require("jsonwebtoken");
const database = require("../interfaces/mongooseInterface");
const { formatUser, compare } = require("../helpers/utils");
const { tokenSecret } = require("../helpers/const");

/*
    Interfaces for authentication
*/

const authInterface = {
    // Logs user in
    login: (email, password, app) => new Promise((resolve, reject) => {
        database.findUser({ email }, app)
            .then((user) => {
                if (!user)
                    throw "Invalid credentials";
                else
                    compare(password, user.password)
                        .then((same) => {
                            if (!same)
                                throw "Invalid password";
                            else {
                                resolve({
                                    ...formatUser(user),
                                    token: jwt.sign(formatUser(user), tokenSecret, { expiresIn: "1h" })
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