import { success, failure } from "@/services/response";
import { validEmail, validPassword, validName } from "@/services/validation";
import { MASTER_EMAIL, ACCOUNT_TYPE } from "@/helpers/const";
import type { Request, Response } from "express";
import type { Account as AccountType } from "@/helpers/types";
import Account from "@/interfaces/account";

/**
 * Controllers and checks for account module
 */

// Creates a new account
export const signUp = (req: Request, res: Response) => {
	const account = req.body as AccountType;
	try {
		account.email = account.email ? account.email.toLowerCase() : "";
		if (!account || Object.keys(account).length === 0)
			throw "Please provide account information";
		else if (!validEmail(account?.email)) throw "Email is invalid";
		else if (!validPassword(account.password))
			throw "Insufficient password strength";
		else if (!validName(account.app)) throw "App name is invalid";
		account.level = 2;
		if (account.email === MASTER_EMAIL) account.level = 0;
		else if (res.locals.admin) account.level = 1;
		Account.create(account, res.locals.admin)
			.then((createdAccount) =>
				res.json(
					success(
						`${ACCOUNT_TYPE[createdAccount.level]} account created`,
						createdAccount
					)
				)
			)
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Creates admin account
export const signUpAdmin = (req: Request, res: Response) => {
	res.locals.admin = true;
	signUp(req, res);
};

// Get the list of admin accounts
export const getAdminList = (req: Request, res: Response) => {
	const { app } = req.params;
	console.log(app);
	try {
		if (!validName(app)) throw "Please provide app name";
		Account.getAdminList(app)
			.then((result) => res.json(success("Admin account list", result)))
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Logs user in
export const signIn = (req: Request, res: Response) => {
	const { email, password, app } = req.body;
	try {
		if (!validEmail(email)) throw "Email is invalid";
		else if (!validPassword(password)) throw "Insufficient password strength";
		else if (!validName(app)) throw "App name is invalid";

		Account.loginUser(app, email, password)
			.then((loggedAccount) => {
				const { token } = loggedAccount;
				res
					.cookie("token", token, {
						httpOnly: true,
						secure: false,
					})
					.json(
						success("Logged in successfully", { ...loggedAccount, token: undefined })
					);
			})
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err.message));
	}
};

// Confirms account
export const confirm = (req: Request, res: Response) => {
	const { id, password } = req.body;
	try {
		if (!id) throw "Please provide the account id";
		else if (!validPassword(password)) throw "Please provide a valid password";

		Account.confirmAccount(id, password)
			.then(() => res.json(success("Account confirmed")))
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Verifies incoming token
export const verify = (req: Request, res: Response) => {
	if (res.locals.account)
		res.json(success("User logged in", res.locals.account));
	else res.json(failure("User not logged in"));
};

// Bans account
export const ban = (req: Request, res: Response) => {
	const { id } = req.body;
	const { email, app } = res.locals.account;
	try {
		if (typeof id !== "string" || id.length === 0)
			throw `Please provide valid ID`;
		Account.banAccount(id, email, app)
			.then(() => res.json(success(`Account ${email} on app ${app} banned`)))
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Unban account
export const unban = (req: Request, res: Response) => {
	const { id } = req.body;
	const { email, app } = res.locals.account;
	try {
		if (typeof id !== "string" || id.length === 0)
			throw `Please provide valid ID`;
		Account.unbanAccount(id, email, app)
			.then(() =>
				res.json(success(`Account ${email} on app ${app} is back to live`))
			)
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Deletes account
export const remove = (req: Request, res: Response) => {
	const { id } = req.body;
	const { email, app } = res.locals.account;
	try {
		if (typeof id !== "string" || id.length === 0)
			throw `Please provide valid ID`;
		Account.deleteAccount(id, email, app)
			.then(() => res.json(success(`Account ${email} on app ${app} removed`)))
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Updates user data
export const update = (req: Request, res: Response) => {
	const { id, updatedData } = req.body;
	try {
		if (typeof id !== "string" || id.length === 0)
			throw `Please provide valid ID`;
		delete updatedData.id;
		delete updatedData.email;
		delete updatedData.level;
		delete updatedData.banned;
		delete updatedData.app;
		delete updatedData.confirmed;
		delete updatedData.created_at;

		Account.updateAccount(id, updatedData)
			.then((updatedAccount) =>
				res.json(success("Account information updated", updatedAccount))
			)
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

export default {
	signUp,
	signUpAdmin,
	getAdminList,
	signIn,
	confirm,
	verify,
	ban,
	unban,
	remove,
	update,
};
