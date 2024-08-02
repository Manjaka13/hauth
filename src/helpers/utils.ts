import type { Account, NewAccount } from "@/helpers/types";

/**
 * Various useful functions
 */

// Formats mongoose data
export const formatData = (data: any): typeof data => {
	if (data) {
		if (data._doc) data = { ...data._doc };
		if (!data.id) data.id = data._id;
	}
	return data;
};

// Formats array of data
export const formatDataList = (dataList: any) => dataList.map(formatData);

// Remove restricted fields
export const protectData = (data: any) => {
	if (data) {
		delete data.password;
		delete data.confirmationId;
		delete data._id;
		delete data.__v;
		delete data.createdAt;
		delete data.updatedAt;
		return data;
	}
	return null;
};

// Protects array of data
export const protectDataList = (dataList: any) => dataList.map(protectData);

/**
 * Checks if the account level given is admin
 * @param account given level to be tested
 * @returns boolean
 */
export const isAdmin = (level: number) =>
	typeof level === "number" && level <= 1;

/**
 * Checks if the account level given is master
 * @param account given level to be tested
 * @returns boolean
 */
export const isMaster = (level: number) =>
	typeof level === "number" && level <= 0;

/**
 * Formats account to new account
 * @param account give the account objet
 * @returns returns the new account format
 */
export const getFormatedNewAccount = (
	account: Account | NewAccount
): NewAccount => ({
	email: account.email,
	firstname: account.firstname,
	lastname: account.lastname,
	password: account.password,
	level: account.level,
	avatar: account.avatar,
	app: account.app,
});
