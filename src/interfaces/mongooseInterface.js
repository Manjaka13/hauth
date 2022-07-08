const Mongoose = require("mongoose");
const User = require("../models/userModel");
const { databaseUrl, databaseName } = require("../helpers/const");
const { formatUser, compare } = require("../helpers/utils");

/*
    Database manipulation through Mongoose
*/

const mongoose = {
    // Connects to MongoDB
    connect: () => Mongoose.connect(`${databaseUrl}/${databaseName}`, { useNewUrlParser: true, useUnifiedTopology: true }),

    // Finds the user that meets the specified fields
    findUser: (researchFields, app) => User.findOne({ ...researchFields, app })
        .then(formatUser),

    // Find user by name
    findUserById: (id) => User.findById(id)
        .then(formatUser),

    // Returns all users for the provided app name
    findUserList: (app) => User.find({ app })
        .then((list) => list.map((account) => formatUser(account))),

    // Creates new user
    createUser: (user, isMaster, hashedPassword, hashedEmail) => new User({
        ...user,
        email: user?.email?.toLowerCase(),
        app: user?.app?.toLowerCase(),
        password: hashedPassword,
        level: isMaster ? 0 : 2,
        status: 0,
        confirmationId: hashedEmail
    }).save()
        .then(formatUser),

    // Updates user data
    updateUser: (id, data) => User.findById(id).updateOne(data),

    // Deletes user
    deleteUser: (id, app) => User.findById(id)
        .then((user) => {
            if (user && user.app === app)
                return user.deleteOne();
            else
                throw "Unable to find this user";
        }),

    // Checks if it's the correct password for this account
    isCorrectPassword: (id, app, password) => User.findById(id)
        .then((user) => {
            if (user.app != app)
                throw "Unable to confirm unexisting account";
            else
                return compare(password, user.password);
        })
        .then((same) => {
            if (!same)
                throw "Password does not match account's password";
        }),

    isCorrectConfirmationId: (id, confirmationId) => User.findById(id)
        .then((user) => {
            if (user.confirmationId != confirmationId)
                throw "Unknown confirmation link";
        })
};

module.exports = mongoose;