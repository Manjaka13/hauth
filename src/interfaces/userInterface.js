const { hash } = require("../helpers/utils");
const { master } = require("../helpers/const");
const database = require("./mongooseInterface");

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
        .then((hashedPassword) => database.createUser(user, user.email === master, hashedPassword)),

    // Returns user list
    get: (app) => database.findUserList(app),

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
    delete: (id, app) => database.deleteUser(id, app)
};

module.exports = userInterface;