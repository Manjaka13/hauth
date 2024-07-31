import Mongoose, { ConnectOptions } from "mongoose";
import Account from "@/models/account";
import { DATABASE_URL, DATABASE_NAME } from "@/helpers/const";
import { type Account as AccountType } from "@/helpers/types";
import { isAdmin } from "@/helpers/utils";

/**
 * Mongoose database service
 */

/**
 * Connects to your mongoose instance
 * @returns Mongoose
 */
export const connect = (): Promise<typeof Mongoose> => {
	Mongoose.set("strictQuery", false);
	return Mongoose.connect(`${DATABASE_URL}/${DATABASE_NAME}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	} as ConnectOptions);
};

/**
 * Finds the account with provided email and app
 * @param app the app unique ID
 * @param email the user's email
 * @returns the account
 */
export const getAccount = (app: string, email: string): Promise<AccountType> =>
	Account.findOne({ app, email }).then((account) => account as AccountType);

/**
 *Get all accounts associated with that app
 * @param app the app where you're searching
 * @returns the list of accounts
 */
export const getAccountList = (app: string) =>
	Account.find({ app }).then((list) => (list.length > 0 ? list : null));

/**
 * Get all admin accounts associated with that app
 * @param app the app where you're searching
 * @returns the list of admin accounts
 */
export const getAdminAccountList = (app: string) =>
	Account.find({ app })
		.then((list) => list.filter((acc) => isAdmin(acc?.level)))
		.then((list) => {
			if (list.length > 0) return list;
		});

/**
 * Creates new account
 * @param data the account to create
 * @returns nothing really useful
 */
export const createAccount = (data: AccountType) => new Account(data).save();

/**
 * Updates account data
 * @param app the current app
 * @param email the email of the account
 * @param newData the new account data
 * @returns nothing really useful
 */
export const updateAccount = (app: string, email: string, newData: any) =>
	Account.findOneAndUpdate({ app, email }, newData);

/**
 * Deletes account
 * @param app the app
 * @param email the email target
 * @returns nothing useful
 */
export const deleteAccount = (app: string, email: string) =>
	Account.deleteOne({ app, email });

/**
 * Gets the owner of a given confirmation ID
 * @param confirmationId the confirmation ID
 * @returns Account, the owner of that confirmation ID
 */
export const getConfirmationIdOwner = (confirmationId: string) =>
	Account.findOne({ confirmationId }).then((account) => account as AccountType);

export default {
	connect,
	getAccount,
	getAccountList,
	getAdminAccountList,
	createAccount,
	updateAccount,
	deleteAccount,
	getConfirmationIdOwner,
};
