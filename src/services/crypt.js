const bcrypt = require("bcrypt");
const { hashSaltRounds } = require("../helpers/const");

/*
    Various crypting functions
*/

const crypt = {
    // Hashes password
    hash: (password) => password ? bcrypt.hash(password, hashSaltRounds) : new Promise((resolve, reject) => reject("Please provide a string to hash")),

    // Compares password
    compare: (password, hashedPassword) => bcrypt.compare(password, hashedPassword),

    // Checks if password matches
    passwordMatch: (password, hashedPassword) => new Promise((resolve, reject) => {
        const error = "Wrong password";
        if (!password || !hashedPassword)
            reject(error);
        else
            crypt.compare(password, hashedPassword)
                .then((same) => {
                    if (!same)
                        reject(error);
                    else
                        resolve();
                })
                .catch(() => reject(error));
    })
};

module.exports = crypt;