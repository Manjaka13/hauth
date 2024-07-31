import type { NextFunction, Request, Response } from "express";
import Database from "@/services/database";
import { failure } from "@/services/response";
import { jwtVerify } from "@/services/jwt";
import { isAdmin } from "@/helpers/utils";

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
		.then(({ app, email }) => Database.getAccount(app, email))
		.then((account) => {
			res.locals.account = account;
		})
		.catch(() => {
			res.locals.account = null;
		})
		.finally(next);
};

// The user must not to be banned to access next route
export const mustNotBanned = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.locals.account && res.locals.account.banned)
		res.json(failure("This account have been banned", res.locals.account));
	else next();
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

// The user must confirm his email to reach the next route
export const mustBeConfirmed = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.locals.account && !res.locals.account.confirmationId) next();
	else res.json(failure("Please confirm your account first"));
};

// The user must be an admin to check the next route
export const mustBeAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (isAdmin(res.locals?.account?.level)) next();
	else res.json(failure("You have to be admin to access this route"));
};

export default {
	getLoggedAccount,
	mustNotBanned,
	mustBeLoggedOut,
	shouldBeLoggedOut,
	mustBeLoggedIn,
	mustBeConfirmed,
	mustBeAdmin,
};
