const bcrypt = require("bcrypt");
const User = require("../models/userModel");

/*
    Interfaces for Users
*/

const userInterface = {
    create: (user) => User.find({
        email: user?.email?.toLowerCase(),
        app: user?.app?.toLowerCase(),
    })
        .then((found) => {
            return found.length > 0;
        })
        .then((existing) => {
            // Account already exists
            if (existing)
                throw "This account already exist";
            // Invalid password
            else if (!user.password || user.password.length < 3)
                throw "Please provide a valid password";
            // Hash password
            else
                return bcrypt.hash(user.password, 10);
        })
        .then((hashedPassword) => {
            // Setup the data
            const newUser = new User({
                ...user,
                email: user?.email?.toLowerCase(),
                app: user?.app?.toLowerCase(),
                password: hashedPassword,
                level: 2,
                status: 0
            });
            // Save the user
            return newUser.save();
        })
        // Everything went good
        .then((newUser) => ({ ...newUser._doc, password: undefined })),

    // Returns user list
    get: () => User.find()
        .then((accountList) => accountList.map((account) => ({ ...account._doc, password: undefined }))),

    // Updates user info
    update: (id, user) => new Promise((resolve, reject) => {
        if (user.email || user.level || user.app || user.status)
            reject("Some fields are immutable and could not be updated");
        else {
            if (user.password)
                bcrypt.hash(user.password, 10)
                    .then((hashedPassword) => User.findById(id).updateOne({ ...user, password: hashedPassword }))
                    .then(() => resolve())
                    .catch((err) => reject(err));
            else
                User.findById(id).updateOne(user)
                    .then(() => resolve())
                    .catch((err) => reject(err));
        }
    }),

    // Deletes user
    delete: (id) => User.findById(id).deleteOne()
};

module.exports = userInterface;