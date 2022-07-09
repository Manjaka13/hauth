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
const hash = (password) => typeof password === "string" ? bcrypt.hash(password, 10) : new Promise((resolve, reject) => reject("Please provide a string to hash"));

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
const removeProtectedFields = (user) => {
	if (!Array.isArray(user) && typeof user === "object") {
		delete user.password;
		delete user.confirmationId;
		return user;
	}
	return null;
};

// Checks if account is admin
const isAdmin = (account) => account ? (account?.level >= 0 && account?.level < 2) : false;

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
