import { success, failure } from "@/services/response";
import { validEmail, validPassword, validName } from "@/services/validation";
import { MASTER_EMAIL, ACCOUNT_TYPE } from "@/helpers/const";
import type { Request, Response } from "express";
import { type Account as AccountType } from "@/helpers/types";
import Account from "@/services/account";

/**
 * Controllers and checks for account module
 */

// Creates a new account
export const create = (req: Request, res: Response) => {
	const account = req.body as AccountType;
	try {
		if (!account || Object.keys(account).length === 0)
			throw "Please provide account information";
		else if (!validEmail(account.email)) throw "Email is invalid";
		else if (!validPassword(account.password))
			throw "Insufficient password strength";
		else if (!validName(account.app)) throw "App name is invalid";
		// delete account.id;
		// delete account.__id;
		// delete account.__v;
		// delete account.createdAt;
		// delete account.updatedAt;
		// delete account.confirmationId;
		account.email = account.email.toLowerCase();
		account.level = 2;
		account.banned = false;
		if (account.email === MASTER_EMAIL) account.level = 0;
		else if (res.locals.admin) account.level = 1;

		Account.createAccount(account)
			.then((account) =>
				res.json(success(`${ACCOUNT_TYPE[account.level]} account created`, account))
			)
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Creates admin account
export const createAdmin = (req: Request, res: Response) => {
	res.locals.admin = true;
	create(req, res);
};

// Get the list of admin accounts
export const getAdminList = (req: Request, res: Response) => {
	const { app } = req.body;
	try {
		if (!validName(app)) throw "Please provide app name";
		Account.getAdminAccountList(app)
			.then((list) => res.json(success("Admin account list", list)))
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Logs user in
export const login = (req: Request, res: Response) => {
	const { email, password, app } = req.body;
	try {
		if (!validEmail(email)) throw "Email is invalid";
		else if (!validPassword(password)) throw "Insufficient password strength";
		else if (!validName(app)) throw "App name is invalid";

		Account.loginUser(app, email, password)
			.then((account) => {
				const { token } = account;
				delete account.token;
				// res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
				// res.setHeader("Access-Control-Allow-Credentials", true);
				// res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
				res
					.cookie("token", token, {
						httpOnly: true,
						secure: false,
					})
					.json(success("Logged in successfully", account));
			})
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err.message));
	}
};

// Confirms account
export const confirm = (req: Request, res: Response) => {
	const { confirmationId, password } = req.body;
	try {
		if (!confirmationId) throw "Please provide the confirmation id";
		else if (!validPassword(password)) throw "Please provide a valid password";

		Account.confirmAccount(confirmationId, password)
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
	const { app, email } = req.body;
	try {
		if (!validEmail(email)) throw "Please provide a valid email";
		else if (!validName(app)) throw "Please provide a valid app name";
		else if (email === res.locals.account.email && app === res.locals.account.app)
			throw "Can not self ban";

		Account.banAccount(app, email)
			.then(() => res.json(success("Account banned")))
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Unbans account
export const unban = (req: Request, res: Response) => {
	const { app, email } = req.body;
	try {
		if (!validEmail(email)) throw "Please provide a valid email";
		else if (!validName(app)) throw "Please provide a valid app name";
		else if (email === res.locals.account.email && app === res.locals.account.app)
			throw "Can not unban self";

		Account.unbanAccount(app, email)
			.then(() => res.json(success("Ban removed from account")))
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Deletes account
export const remove = (req: Request, res: Response) => {
	const { app, email } = req.body;
	try {
		if (!validEmail(email)) throw "Please provide a valid email";
		else if (!validName(app)) throw "Please provide a valid app name";
		else if (email === res.locals.account.email && app === res.locals.account.app)
			throw "Can not delete self";

		Account.deleteAccount(app, email)
			.then(() => res.json(success("Account deleted")))
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

// Updates user data
export const update = (req: Request, res: Response) => {
	const { app, email } = res.locals.account;
	const account = req.body;
	try {
		if (!validEmail(email) || !validName(app)) throw "Please login";
		delete account.app;
		delete account.email;
		delete account.level;
		delete account.banned;
		delete account.confirmationId;

		Account.updateAccount(app, email, account)
			.then(() => res.json(success("Account information updated")))
			.catch((err) => res.json(failure(err)));
	} catch (err: any) {
		res.json(failure(err));
	}
};

export default {
	create,
	createAdmin,
	getAdminList,
	login,
	confirm,
	verify,
	ban,
	unban,
	remove,
	update,
};
