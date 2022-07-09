const bcrypt = require("bcrypt");

/*
	Various usefull functions
*/

// Returns server result as JSON
const answer = (caption, payload, status) => ({
	status:
		typeof status === "number" && (status === 1 || status === 0) ? status : 0,
	payload: payload ? payload : undefined,
	caption: typeof caption === "string" ? caption : undefined,
});

// Returns catched error
const failure = (err) => answer(err?._message ? err._message : typeof err === "string" ? err : "An error occured");

// Returns good answer
const success = (caption, payload) => answer(caption, payload, 1);

// Hashes password
const hash = (password) => bcrypt.hash(password, 10);

// Compares password
const compare = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

// Checks if email is valid
const isValidEmail = (email) => (
	typeof email === "string" &&
	email
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
);

// Checks password
const isValidPassword = (password) => typeof password === "string" && password.length > 2;

// Checks app name
const isValidAppName = (app) => typeof app === "string" && app.length > 2;

// Format mongoose data
const mongooseFormat = (user) => user ? ({ ...user._doc, id: user.id, _id: undefined }) : null;

// Returns only specific fields
const removeProtectedFields = (user) => user ? ({ ...user, password: undefined, confirmationId: undefined }) : null;

// Checks if account is admin
const isAdmin = (account) => account.level < 2;

module.exports = {
	answer,
	success,
	failure,
	hash,
	compare,
	isValidEmail,
	isValidPassword,
	isValidAppName,
	mongooseFormat,
	removeProtectedFields,
	isAdmin
};
