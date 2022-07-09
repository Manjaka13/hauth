const { v4 } = require("uuid");
const { isAdmin, hash, compare, removeProtectedFields } = require("../helpers/utils");

/*
    Account service
*/

module.exports = (database, jwt) => {
    return {
        // Creates new account
        create: (account) => database.getAccountList(account.app)
            .then((accountList) => accountList?.filter(isAdmin))
            .then(adminAccountList => {
                if (!adminAccountList && !isAdmin(account))
                    throw "You have to create an admin account on that app first";
                else
                    return database.getAccount(account);
            })
            .then((exist) => {
                if (exist)
                    throw `${exist.email} already has an account on that app`;
                else
                    return hash(account.password);
            })
            .then((hashedPassword) => {
                account.password = hashedPassword;
                account.confirmationId = v4();
                return database.createAccount(account);
            }),

        // Get associated account
        get: (account) => new Promise((resolve, reject) => {
            if (!account || !account.email || !account.app)
                reject("Unexisting account");
            else
                database.getAccount(account)
                    .then((account) => resolve(account))
                    .catch(err => reject(err));
        }),

        // Gets list of admin
        getAdminList: (app) => database.getAccountList(app)
            .then((accountList) => {
                if (!accountList)
                    throw "That app has no admin or does not exist yet";
                else
                    return accountList.filter((account) => account.level < 2);
            }),

        // Login
        login: (account) => {
            let user = null;
            return database.getAccount(account)
                .then((found) => {
                    if (!found)
                        throw `${account.email} does not have an account yet`;
                    else if (found.banned)
                        throw `${account.email} was banned`;
                    else if (found.confirmationId)
                        throw "Please confirm your email first";
                    else {
                        user = found;
                        return compare(account.password, user.password);
                    }
                })
                .then((samePassword) => {
                    if (!samePassword)
                        throw "Wrong password";
                    else {
                        user = removeProtectedFields(user);
                        return jwt.create(user);
                    }
                })
                .then((token) => {
                    user.token = token;
                    return user;
                })
        },

        // Confirm account
        confirm: (account) => database.confirmAccount({ app: account.app, confirmationId: account.confirmationId, password: account.password }),

        // Bans account
        ban: (account) => database.setAccountBan(account, true),

        // Unbans account
        unban: (account) => database.setAccountBan(account, false),

        // Deletes account
        delete: (account) => database.delete(account)
    };
};
