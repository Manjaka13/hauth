const jwt = require("jsonwebtoken");
const Mongoose = require("mongoose");
const User = require("../models/userModel");
const { databaseUrl, databaseName } = require("../helpers/const");
const { mongooseFormat, compare } = require("../helpers/utils");

/*
    Database manipulation through Mongoose
*/

const mongoose = {
    // Connects to MongoDB
    connect: () => Mongoose.connect(`${databaseUrl}/${databaseName}`, { useNewUrlParser: true, useUnifiedTopology: true }),

    // Finds the user that meets the specified fields
    findUser: (researchFields, app) => User.findOne({ ...researchFields, app })
        .then(mongooseFormat),

    // Find user by name
    findUserById: (id) => User.findById(id)
        .then(mongooseFormat),

    // Returns all users for the provided app name
    findUserList: (app) => User.find({ app })
        .then((list) => list.map(mongooseFormat)),

    // Creates new user
    createUser: (user, level, hashedPassword, hashedEmail) => new User({
        ...user,
        email: user?.email?.toLowerCase(),
        app: user?.app?.toLowerCase(),
        password: hashedPassword,
        level,
        status: 0,
        confirmationId: hashedEmail
    }).save()
        .then(mongooseFormat),

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

    // Check confirmation process
    isConfirmationCorrect: (id, app, password, confirmationId) => User.findById(id)
        .then((user) => {
            if (user.confirmationId != confirmationId)
                throw "Unknown confirmation link";
            else if (user.app != app)
                throw "Unable to confirm unexisting account";
            else
                return compare(password, user.password);
        })
        .then((same) => {
            if (!same)
                throw "Password does not match account's password";
        }),
};

module.exports = mongoose;