const jsonwebtoken = require("jsonwebtoken");
const { tokenSecret, tokenExpiration } = require("../helpers/const");

/*
    JWT to create authentication tokens
*/

const jwt = {
    // Creates new token
    create: (data) => new Promise((resolve, reject) => {
        if (!data || Object.keys(data).length === 0)
            reject("Please provide data from which to create token");
        else
            resolve(jsonwebtoken.sign(data, tokenSecret, { expiresIn: tokenExpiration }));
    }),

    // Verifies a token, returns the according user
    verify: (token) => new Promise((resolve, reject) => {
        if (!token)
            reject("Please login first");
        else {
            jsonwebtoken.verify(token, tokenSecret, (err, account) => {
                if (err)
                    reject("Invalid or expired token, please login again");
                else
                    resolve(account);
            })
        }
    })
};

module.exports = jwt;