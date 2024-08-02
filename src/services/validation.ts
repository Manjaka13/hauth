/**
 * Validations
 */

/**
 * Checks if the email is valid or not
 * @param email string, the email address
 * @returns boolean
 */
export const validEmail = (email?: string): boolean =>
	typeof email === "string" &&
	Array.isArray(
		email
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
	);

/**
 * Validates the given password
 * @param password string, the password to test
 * @returns boolean
 */
export const validPassword = (password?: string): boolean =>
	typeof password === "string" && password.length > 2;

/**
 * Checks if given name is valid
 * @param name string, name to be tested
 * @returns boolean
 */
export const validName = (name?: string): boolean =>
	typeof name === "string" && Array.isArray(name.match(/^[a-zA-Z-]{3,}$/));
