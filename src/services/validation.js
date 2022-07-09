/*
    Data validation
*/

const validation = {
    // Validates email
    email: (email) =>
        typeof email === "string" &&
        email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),

    // Checks password
    password: (password) => typeof password === "string" && password.length > 2,

    // Validates name
    name: (name) => typeof name === "string" && name.match(/^[a-zA-Z]{3,}$/),
};

module.exports = validation;