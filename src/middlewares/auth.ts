import type { NextFunction, Request, Response } from "express";
import Database from "@/services/database";
import { failure } from "@/services/response";
import { jwtVerify } from "@/services/jwt";
import { isAdmin, isMaster } from "@/helpers/utils";
import { Account } from "@/helpers/types";

/**
 * Authentication middlewares
 */

/**
 * Generates the account object from given token in request
 * If valid, the account will be saved in the response locals
 */
export const getLoggedAccount = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { token } = req.cookies;
	jwtVerify(token)
		.then(({ id }) => Database.getAccountById(id))
		.then((account) => {
			res.locals.account = account;
		})
		.catch(() => {
			res.locals.account = null;
		})
		.finally(next);
};

// User must be logged out to access next route
export const mustBeLoggedOut = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.locals.account) res.json(failure("Please logout first"));
	else next();
};

// User "should" be logged out for the next route
export const shouldBeLoggedOut = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.locals.account) res.json(failure("You are already connected"));
	else next();
};

// User must be logged in to access next route
export const mustBeLoggedIn = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.locals.account) next();
	else res.json(failure("Please login first"));
};

// The user must be a master to check the next route
export const mustBeMaster = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (isMaster(res.locals?.account?.level)) next();
	else res.json(failure("You have to be a master to access this route"));
};

// The user must not be banned to access the next route
export const checkBan = (req: Request, res: Response, next: NextFunction) => {
	if (res.locals?.account?.banned) res.json(failure("You have been banned"));
	else next();
};

/**
 * Promise middleware
 */
export const mustNotBanned = (account: Account): Promise<Account> =>
	new Promise((resolve, reject) => {
		if (account.banned) reject(`${account.email} was banned from this service`);
		else resolve(account);
	});

export const mustBeConfirmed = (account: Account): Promise<Account> =>
	new Promise((resolve, reject) => {
		if (!account.confirmed) reject(`This account has not yet been confirmed`);
		else resolve(account);
	});

export const mustBeAdmin = (account: Account): Promise<Account> =>
	new Promise((resolve, reject) => {
		if (!isAdmin(account.level)) reject(`This action needs admin privileges`);
		else resolve(account);
	});

export default {
	getLoggedAccount,
	mustNotBanned,
	mustBeLoggedOut,
	shouldBeLoggedOut,
	mustBeLoggedIn,
	mustBeConfirmed,
	mustBeAdmin,
};
