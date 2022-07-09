const Mongoose = require("mongoose");
const Account = require("../models/account");
const { databaseUrl, databaseName } = require("../helpers/const");
const { mongooseFormat, compare } = require("../helpers/utils");

/*
    Mongoose database service
*/

const mongoose = {
    // Connects to MongoDB
    connect: () => Mongoose.connect(`${databaseUrl}/${databaseName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }),

    // Finds the account with provided email or id and app
    getAccount: (account) => Account.findOne({ email: account.email, app: account.app })
        .then(mongooseFormat),

    // Get all accounts associated with that app
    getAccountList: (app) => Account.find({ app })
        .then((accountList) => accountList && accountList.length > 0 ? accountList.map((account) => mongooseFormat(account)) : null),

    // Creates new account
    createAccount: (account) => new Account(account).save()
        .then(mongooseFormat),

    // Updates account data
    updateAccount: (account) => Account.findOne({ email: account.email, app: account.app })
        .updateOne({ ...account, email: undefined, app: undefined })
        .then(mongooseFormat),

    // Deletes account
    deleteAccount: (account) => Account.findOne({ email: account.email, app: account.app })
        .deleteOne(),

    // Confirms account
    confirmAccount: (account) => Account.findOne({ app: account.app, confirmationId: account.confirmationId })
        .then((found) => {
            if (!found)
                throw "Invalid confirmation id";
            else
                return compare(account.password, found.password)
                    .then((same) => {
                        if (!same)
                            throw "Password does not match the account's password";
                        else
                            return found.updateOne({ confirmationId: "" });
                    });
        }),

    // Manage bans
    setAccountBan: (account, ban) => Account.findOne({ email: account.email, app: account.app })
        .updateOne({ banned: ban }),

    // Deletes account
    delete: (account) => Account.findOne({ email: account.email, app: account.app })
        .deleteOne(),

    // Updates user data
    updateAccount: (id, data) => Account.findById(id).updateOne(data),
};

module.exports = mongoose;