import { createClient } from "@supabase/supabase-js";
import { SUPABASE_APIKEY, SUPABASE_URL } from "@/helpers/const";
import { Account, AccountPartial, NewAccount } from "@/helpers/types";

/**
 * Supabase postgres service
 * This file has all methods for ata persistence
 */

// Create supabase client
const Supabase = createClient(SUPABASE_URL, SUPABASE_APIKEY);

/**
 * Retrieve complete list of accounts
 * @returns Account[]
 */
export const getAllAccounts = async (): Promise<Account[]> => {
	const { data, error } = await Supabase.from("account").select("*");
	if (error) throw error;
	return data;
};

/**
 * Retrieves all accounts in a given app
 * @param app string, the app id in hauth
 * @returns Account[]
 */
export const getAllAppAccounts = async (app: string): Promise<Account[]> => {
	const { data, error } = await Supabase.from("account")
		.select("*")
		.eq("app", app);
	if (error) throw error;
	return data;
};

/**
 * Get account by its id
 * @param id string, the id of the account
 * @returns Account | null
 */
export const getAccountById = async (id: string): Promise<Account | null> => {
	const { data, error } = await Supabase.from("account")
		.select("*")
		.eq("id", id);
	if (error) throw error;
	return data.length !== 0 ? data[0] : null;
};

/**
 * Get an account by its app membership and email
 * @param app string, the id of the target app
 * @param email string, the email of the account
 * @returns Account | null
 */
export const getAccountByAppEmail = async (
	app: string,
	email: string
): Promise<Account | null> => {
	const { data, error } = await Supabase.from("account")
		.select("*")
		.eq("app", app)
		.eq("email", email);
	if (error) throw error;
	return data.length !== 0 ? data[0] : null;
};

/**
 * Creates new account
 * @param account Account, the account informations to be created
 * @returns Account, the created account
 */
export const createAccount = async (account: NewAccount): Promise<Account> => {
	const { data, error } = await Supabase.from("account")
		.insert([account])
		.select();
	if (error) throw error;
	return data[0];
};

/**
 * Updates fields in a given account
 * @param id string, the id of the account
 * @param updatedAccount AccountPartial, the fields to be updated
 * @returns Account, the account with the new values updated
 */
export const updateAccount = async (
	id: string,
	updatedAccount: AccountPartial
): Promise<Account> => {
	const { data, error } = await Supabase.from("account")
		.update(updatedAccount)
		.eq("id", id)
		.select();
	if (error) throw error;
	return data[0];
};

/**
 * Removes account by id, success even if id does not exist
 * @param id string, the id of the account to be removed
 */
export const removeAccount = async (id: string) => {
	const { error } = await Supabase.from("account").delete().eq("id", id);
	if (error) throw error;
};

export default {
	getAllAccounts,
	getAllAppAccounts,
	getAccountById,
	getAccountByAppEmail,
	createAccount,
	updateAccount,
	removeAccount,
};
