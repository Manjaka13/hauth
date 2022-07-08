const Mongoose = require("mongoose");
const User = require("../models/userModel");
const { databaseUrl, databaseName } = require("../helpers/const");

/*
    Database manipulation through Mongoose
*/

const mongoose = {
    // Connects to MongoDB
    connect: () => Mongoose.connect(`${databaseUrl}/${databaseName}`, { useNewUrlParser: true, useUnifiedTopology: true }),

    // Finds the user that meets the specified fields
    findUser: (researchFields, app) => User.findOne({ ...researchFields, app }),

    // Find user by name
    findUserById: (id) => User.findById(id),

    // Returns all users for the provided app name
    findUserList: (app) => User.find({ app })
        .then((list) => list.map((account) => ({ ...account._doc, password: undefined }))),

    // Creates new user
    createUser: (user, isMaster, hashedPassword) => new User({
        ...user,
        email: user?.email?.toLowerCase(),
        app: user?.app?.toLowerCase(),
        password: hashedPassword,
        level: isMaster ? 0 : 2,
        status: 0
    }).save()
        .then((newUser) => {
            return { ...newUser._doc, password: undefined };
        }),

    // Updates user data
    updateUser: (id, data) => User.findById(id).updateOne(data),

    // Deletes user
    deleteUser: (id, app) => User.findById(id)
        .then((user) => {
            if (user && user.app === app)
                return user.deleteOne();
            else
                throw "Unable to find this user";
        })
};

module.exports = mongoose;