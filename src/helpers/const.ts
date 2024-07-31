import { v4 as uuidv4 } from "uuid";

/**
 * Export constants from here
 */

// Server
export const SERVER_PORT = process.env.SERVER_PORT || "3001";

// Database
export const DATABASE_URL = process.env.DATABASE_HOST || "";
export const DATABASE_NAME = process.env.DATABASE_NAME || "";

// Auth
export const TOKEN_SECRET = process.env.TOKEN_SECRET || uuidv4();
export const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "1h";
export const HASH_SALT_ROUNDS = 10;
export const ACCOUNT_TYPE = ["Master", "Admin", "User"];
export const MASTER_EMAIL =
	process.env.MASTER_EMAIL || "manjaka.rajaonson@gmail.com";

// API endpoint documentation
export const DOCUMENTATION = {
	"/": {
		access: "public, no login",
		type: "GET",
		description: "The current API documentation.",
	},
	"user/get": {
		access: "master, needs login",
		type: "GET",
		description: "Gets all accounts in master's app",
	},
	"user/get/admin": {
		access: "public, no login",
		type: "GET",
		description: "Gets provided app's admin list",
		parameters: {
			app: "String, required",
		},
	},
	"user/create": {
		access: "public, no login",
		type: "POST",
		description: "Creates new user",
		parameters: {
			firstname: "String",
			lastname: "String",
			avatar: "String",
			email: "String, required",
			password: "String, required",
			app: "String, required",
		},
	},
	"user/create/admin": {
		access: "public, no login",
		type: "POST",
		description: "Creates admin user",
		parameters: {
			firstname: "String",
			lastname: "String",
			avatar: "String",
			email: "String, required",
			password: "String, required",
			app: "String, required",
		},
	},
	"user/update": {
		access: "public, needs login",
		type: "PUT",
		description: "Updates user information",
		parameters: {
			firstname: "String",
			lastname: "String",
			avatar: "String",
			password: "String",
		},
		note:
			"The account id to be updated is extracted from provided token in authorization header",
	},
	"user/delete/:id": {
		access: "master, needs login",
		type: "DELETE",
		description: "Deletes user",
		node: "Can not self delete",
	},
	"user/confirm/:id": {
		access: "public, needs password",
		type: "POST",
		description: "Confirms user account",
		parameters: {
			confirmationId: "String, required",
			app: "String, required",
			password: "String, required",
		},
	},
	"user/login": {
		access: "public, no login",
		type: "POST",
		description: "Logs user in, returns user with token",
		parameters: {
			email: "String, required",
			password: "String, required",
			app: "String, required",
		},
	},
	"user/verify": {
		access: "public, no login",
		type: "POST",
		description: "Verifies given token (in Authorization bearer or body)",
		parameters: {
			token: "String, required",
		},
	},
	"user/ban/:id": {
		access: "master, needs login",
		type: "PUT",
		description: "Bans the account",
	},
	"user/unban/:id": {
		access: "master, needs login",
		type: "PUT",
		description: "Unbans the account",
	},
};
