import type { Account, LoggedAccount } from "@/helpers/types";
import Database from "@/services/database";
import { getFormatedNewAccount, isAdmin } from "@/helpers/utils";
import { hashPassword, matchPassword } from "@/services/crypto";
import { jwtCreate } from "@/services/jwt";

/**
 * Module that handles account actions
 */

/**
 * Initiate all steps before creating new account
 * @param account the account to be created
 * @returns the created account
 */
export const create = (account: Account, force?: boolean) =>
	Database.getAllAppAccounts(account.app)
		.then((result) => result.filter((r) => isAdmin(r.level)))
		.then((adminsList) => {
			if (force || (Array.isArray(adminsList) && adminsList.length > 0))
				return Database.getAccountByAppEmail(account.app, account.email);
			else throw "You have to create an admin account on that app first";
		})
		.then((exists) => {
			if (exists) throw `${account.email} already has an account on that app`;
			else return hashPassword(account.password);
		})
		.then((hashedPassword) => {
			account.password = hashedPassword;
			return Database.createAccount(getFormatedNewAccount(account));
		});

/**
 * Interface for getting the list of admin in app
 * @param app the app target
 * @returns Account[], admin list
 */
export const getAdminList = (app: string) =>
	Database.getAllAppAccounts(app).then((result) =>
		result.filter((r) => isAdmin(r.level))
	);

export const loginUser = (app: string, email: string, password: string) => {
	let targetAccount: any;
	return Database.getAccountByAppEmail(app, email)
		.then((account) => {
			if (!account) throw `${email} is associated to no account`;
			else if (account.banned) throw `${email} was banned`;
			else if (!account.confirmed) throw "Please confirm your email first";
			else {
				const hashedPassword = account.password;
				targetAccount = account;
				return matchPassword(password, hashedPassword);
			}
		})
		.then((match) => {
			if (!match) throw "Password is invalid";
			else {
				delete targetAccount.password;
				return jwtCreate(targetAccount);
			}
		})
		.then((token) => {
			targetAccount.token = token;
			return targetAccount as LoggedAccount;
		});
};

// Confirm account
export const confirmAccount = (id: string, password: string) =>
	Database.getAccountById(id)
		.then((account) => {
			if (!account) throw "Unknown account id";
			else return matchPassword(password, account.password);
		})
		.then(() => Database.updateAccount(id, { confirmed: true }));

// Bans account
export const banAccount = (
	id: string,
	incomingEmail: string,
	incomingApp: string
) =>
	Database.getAccountById(id).then((account) => {
		if (!account) throw "This account does not exist";
		else if (incomingEmail === account.email && incomingApp === account.app)
			throw "Can not self ban";
		else return Database.updateAccount(id, { banned: true });
	});

// Unbans account
export const unbanAccount = (
	id: string,
	incomingEmail: string,
	incomingApp: string
) =>
	Database.getAccountById(id).then((account) => {
		if (!account) throw "This account does not exist";
		else if (incomingEmail === account.email && incomingApp === account.app)
			throw "Can not self unban";
		else return Database.updateAccount(id, { banned: false });
	});

// Deletes account
export const deleteAccount = (
	id: string,
	incomingEmail: string,
	incomingApp: string
) =>
	Database.getAccountById(id).then((account) => {
		if (!account) throw "This account does not exist";
		else if (incomingEmail === account.email && incomingApp === account.app)
			throw "Can not self delete";
		else return Database.removeAccount(id);
	});

// Updates account data
export const updateAccount = (id: string, updatedData: any) => {
	return Database.getAccountById(id)
		.then((account) => {
			if (!account) throw "This id is associated to no account";
			else {
				if (updatedData.password) return hashPassword(updatedData.password);
				else return null;
			}
		})
		.then((hashedPassword) => {
			if (hashedPassword)
				return Database.updateAccount(id, {
					...updatedData,
					password: hashedPassword,
				});
			else return Database.updateAccount(id, updatedData);
		});
};

export default {
	create,
	getAdminList,
	loginUser,
	confirmAccount,
	banAccount,
	unbanAccount,
	deleteAccount,
	updateAccount,
};
