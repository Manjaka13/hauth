const Mongoose = require("mongoose");
const Account = require("../models/account");
const {
    databaseUrl,
    databaseName
} = require("../helpers/const");

/*
    Mongoose database service
*/

module.exports = {
    // Connects to MongoDB
    connect: () => Mongoose.connect(`${databaseUrl}/${databaseName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }),

    // Finds the account with provided email or id and app
    getAccount: (app, email) => Account.findOne({ app, email }),

    // Get all accounts associated with that app
    getAccountList: (app) => Account.find({ app }).then((list) => list.length > 0 ? list : null),

    // Creates new account
    createAccount: (data) => new Account(data).save(),

    // Updates account data
    updateAccount: (account, data) => account.updateOne(data),

    // Deletes account
    deleteAccount: (account) => account.deleteOne(),

    // Gets the owner of given confirmation id
    getConfirmationIdOwner: (confirmationId) => Account.findOne({ confirmationId }),
};