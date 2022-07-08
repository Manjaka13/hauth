const jwt = require("jsonwebtoken");
const { hash, compare, removeProtectedFields } = require("../helpers/utils");
const { master, tokenSecret } = require("../helpers/const");
const database = require("../interfaces/mongooseInterface");

/*
    Interfaces for Users
*/

const userInterface = {
    // Creates new user
    create: (user) => database.findUser({ email: user?.email }, user?.app)
        .then((exists) => {
            if (exists)
                throw "This account already exist";
            else if (!user.password || user.password.length < 3)
                throw "Please provide a valid password";
            else
                return hash(user.password);
        })
        .then((hashedPassword) => {
            return hash(user.email)
                .then((hashedEmail) => database.createUser(user, user.email === master, hashedPassword, hashedEmail))
                .then(removeProtectedFields);
        }),

    // Returns user list
    getAll: (app) => database.findUserList(app)
        .then(removeProtectedFields),

    // Returns user with provided id and app
    get: (id, app) => database.findUserById(id)
        .then((user) => user.app === app ? removeProtectedFields(user) : null),

    // Updates user info
    update: (id, user) => new Promise((resolve, reject) => {
        if (user.email || user.level || user.app || user.status || user.confirmationId)
            reject("Some fields are immutable and could not be updated");
        else {
            hash(user.password || "foo")
                .then(hashedPassword => {
                    if (user.password)
                        return database.updateUser(id, { ...user, password: hashedPassword });
                    else
                        return database.updateUser(id, user);
                })
                .then(() => resolve())
                .catch((err) => reject(err));
        }
    }),

    // Deletes user
    delete: (id, app) => database.deleteUser(id, app),

    // Confirm user accoutn
    confirm: (id, app, password, confirmationId) => database.isConfirmationCorrect(id, app, password, confirmationId)
        .then(() => database.updateUser(id, { status: 1, confirmationId: "" })),

    // Logs user in
    login: (email, password, app) => new Promise((resolve, reject) => {
        let user = {};
        database.findUser({ email }, app)
            .then((foundUser) => {
                user = foundUser;
                if (!user)
                    throw "Invalid credentials";
                else if (user.status === 0)
                    throw "Please confirm your account first";
                else if (user.status === 2)
                    throw "This account is banned";
                else
                    return compare(password, user.password);
            })
            .then((same) => {
                if (!same)
                    throw "Invalid password";
                else {
                    user = removeProtectedFields(user);
                    user.token = jwt.sign(user, tokenSecret, { expiresIn: "1h" });
                    resolve(user);
                }
            })
            .catch(err => reject(err));
    }),

    // Verifies user token validity
    verify: (token) => new Promise((resolve, reject) => {
        jwt.verify(token, tokenSecret, (err, user) => {
            if (err)
                reject("Please login first.");
            else
                resolve(removeProtectedFields(user));
        });
    }),

    // Bans user
    ban: (id) => database.updateUser(id, { status: 2 })
};

module.exports = userInterface;