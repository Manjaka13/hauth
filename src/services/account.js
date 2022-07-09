const { v4 } = require("uuid");
const {
    filterAdmin,
    isAdmin,
    formatData,
    formatDataList,
    protectData,
    protectDataList
} = require("../helpers/utils");
const { hash, passwordMatch } = require("./crypt");

/*
    Account service
*/

module.exports = (database, jwt) => {
    return {
        // Creates new account
        create: (data) => database.getAccountList(data.app)
            .then(filterAdmin)
            .then((adminExist) => {
                if (!adminExist && !isAdmin(data))
                    throw "You have to create an admin account on that app first";
                else
                    return database.getAccount(data.app, data.email);
            })
            .then((exist) => {
                if (exist)
                    throw `${exist.email} already has an account on that app`;
                else
                    return hash(data.password);
            })
            .then((hashedPassword) => {
                data.password = hashedPassword;
                data.confirmationId = v4();
                return database.createAccount(data);
            })
            .then(formatData)
            .then(protectData),

        // Get the account associated to this email
        get: (app, email) => database.getAccount(app, email)
            .then((found) => {
                if (!found)
                    throw `${email} is associated to no account`;
                else
                    return found;
            })
            .then(formatData)
            .then(protectData),

        // Gets list of admin
        getAdminList: (app) => database.getAccountList(app)
            .then(filterAdmin)
            .then(list => {
                if (!list)
                    throw "No admin account found";
                else
                    return list;
            })
            .then(formatDataList)
            .then(protectDataList),

        // Login
        login: (app, email, password) => {
            let targetAccount = null;
            return database.getAccount(app, email)
                .then((account) => {
                    if (!account)
                        throw `${email} is associated to no account`;
                    else if (account.banned)
                        throw `${email} was banned`;
                    else if (account.confirmationId)
                        throw "Please confirm your email first";
                    else {
                        targetAccount = account;
                        return passwordMatch(password, targetAccount.password);
                    }
                })
                .then(() => formatData(targetAccount))
                .then(protectData)
                .then((formatedData) => {
                    targetAccount = formatedData;
                    return jwt.create(formatedData);
                })
                .then((token) => {
                    targetAccount.token = token;
                    return targetAccount;
                })
        },

        // Confirm account
        confirm: (confirmationId, password) => {
            let owner = null;
            return database.getConfirmationIdOwner(confirmationId)
                .then((account) => {
                    if (!account)
                        throw "Unknown confirmation id";
                    else {
                        owner = account;
                        return passwordMatch(password, account.password);
                    }
                })
                .then(() => database.updateAccount(owner, { confirmationId: "" }))
        },

        // Bans account
        ban: (app, email) => database.getAccount(app, email)
            .then((account) => {
                if (!account)
                    throw `${email} is associated to no account`;
                else
                    return database.updateAccount(account, { banned: true });
            }),

        // Unbans account
        unban: (app, email) => database.getAccount(app, email)
            .then((account) => {
                if (!account)
                    throw `${email} is associated to no account`;
                else
                    return database.updateAccount(account, { banned: false });
            }),

        // Deletes account
        delete: (app, email) => database.getAccount(app, email)
            .then((account) => {
                if (!account)
                    throw `${email} is associated to no account`;
                else
                    return database.deleteAccount(account);
            }),

        // Updates account data
        update: (app, email, data) => {
            let targetAccount = null;
            return database.getAccount(app, email)
                .then((account) => {
                    if (!account)
                        throw `${email} is associated to no account`;
                    else {
                        targetAccount = account;
                        return hash(data.password || "foo");
                    }
                })
                .then((hashedPassword) => {
                    if (data.password)
                        return database.updateAccount(targetAccount, { ...data, password: hashedPassword });
                    else
                        return database.updateAccount(targetAccount, data);
                });
        },
    };
};
