const { hash } = require("../helpers/utils");
const { master } = require("../helpers/const");
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
                .then((hashedEmail) => database.createUser(user, user.email === master, hashedPassword, hashedEmail));
        }),

    // Returns user list
    getAll: (app) => database.findUserList(app),

    // Returns user with provided id and app
    get: (id, app) => database.findUserById(id)
        .then((user) => user.app === app ? user : null),

    // Updates user info
    update: (id, user) => new Promise((resolve, reject) => {
        if (user.email || user.level || user.app || user.status)
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
    confirm: (confirmationId, id, app, password) => database.isCorrectConfirmationId(id, confirmationId)
        .then(() => database.isCorrectPassword(id, app, password))
        .then(() => database.updateUser(id, { status: 1, confirmationId: null }))
};

module.exports = userInterface;