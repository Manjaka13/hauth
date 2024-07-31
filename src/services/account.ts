import { Account } from "@/helpers/types";
import { hashPassword, matchPassword } from "@/services/crypto";
import Database from "@/services/database";
import { jwtCreate } from "@/services/jwt";
import { v4 as uuidv4 } from "uuid";
import {
	formatData,
	formatDataList,
	protectData,
	protectDataList,
} from "@/helpers/utils";

/**
 * Account interface
 */

// Creates account
export const createAccount = (account: Account): Promise<Account> =>
	Database.getAdminAccountList(account.app)
		.then((adminExists) => {
			if (!adminExists)
				throw "You have to create an admin account on that app first";
			else return Database.getAccount(account.app, account.email);
		})
		.then((exist) => {
			if (exist) throw `${exist.email} already has an account on that app`;
			else return hashPassword(account.password);
		})
		.then((hashedPassword) => {
			account.password = hashedPassword;
			account.confirmationId = uuidv4();
			return Database.createAccount(account);
		})
		.then(formatData)
		.then(protectData);

// Get the account associated to this email
export const getAccount = (app: string, email: string): Promise<Account> =>
	Database.getAccount(app, email)
		.then((found) => {
			if (!found) throw `${email} is associated to no account`;
			else return found;
		})
		.then(formatData)
		.then(protectData);

// Gets list of admin account
export const getAdminAccountList = (app: string): Promise<Account[] | void> =>
	Database.getAdminAccountList(app).then((list) => {
		if (list && list.length > 0) {
			list = formatDataList(list);
			list = protectDataList(list);
			return list as Account[];
		}
	});

// Logs user in
export const loginUser = (app: string, email: string, password: string) => {
	let targetAccount: any;
	return Database.getAccount(app, email)
		.then((account) => {
			if (!account) throw `${email} is associated to no account`;
			else if (account.banned) throw `${email} was banned`;
			else if (account.confirmationId) throw "Please confirm your email first";
			else {
				targetAccount = account;
				return matchPassword(password, targetAccount.password);
			}
		})
		.then(() => formatData(targetAccount))
		.then(protectData)
		.then((formatedData) => {
			targetAccount = formatedData;
			return jwtCreate(formatedData);
		})
		.then((token) => {
			targetAccount.token = token;
			return targetAccount;
		});
};

// Confirm account
export const confirmAccount = (confirmationId: string, password: string) => {
	let owner: any;
	return Database.getConfirmationIdOwner(confirmationId)
		.then((account) => {
			if (!account) throw "Unknown confirmation id";
			else {
				owner = account;
				return matchPassword(password, account.password);
			}
		})
		.then(() =>
			Database.updateAccount(owner.app, owner.email, { confirmationId: "" })
		);
};

// Bans account
export const banAccount = (app: string, email: string) =>
	Database.getAccount(app, email).then((account) => {
		if (!account) throw `${email} is associated to no account`;
		else
			return Database.updateAccount(account.app, account.email, { banned: true });
	});

// Unbans account
export const unbanAccount = (app: string, email: string) =>
	Database.getAccount(app, email).then((account) => {
		if (!account) throw `${email} is associated to no account`;
		else
			return Database.updateAccount(account.app, account.email, { banned: false });
	});

// Deletes account
export const deleteAccount = (app: string, email: string) =>
	Database.getAccount(app, email).then((account) => {
		if (!account) throw `${email} is associated to no account`;
		else return Database.deleteAccount(account.app, account.email);
	});

// Updates account data
export const updateAccount = (app: string, email: string, data: any) => {
	let targetAccount: any;
	return Database.getAccount(app, email)
		.then((account) => {
			if (!account) throw `${email} is associated to no account`;
			else {
				targetAccount = account;
				return hashPassword(data.password || "foo");
			}
		})
		.then((hashedPassword) => {
			if (data.password)
				return Database.updateAccount(targetAccount.app, targetAccount.email, {
					...data,
					password: hashedPassword,
				});
			else
				return Database.updateAccount(targetAccount.app, targetAccount.email, data);
		});
};

export default {
	createAccount,
	getAccount,
	getAdminAccountList,
	loginUser,
	confirmAccount,
	banAccount,
	unbanAccount,
	deleteAccount,
	updateAccount,
};
