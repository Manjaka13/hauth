const { isAdmin, hash } = require("../helpers/utils");

/*
    Account service
*/

module.exports = (database) => {
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
                return hash(account.email);
            })
            .then((hashedEmail) => {
                account.confirmationId = hashedEmail;
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
            })
    };
};
