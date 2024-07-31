import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { TOKEN_SECRET, TOKEN_EXPIRATION } from "@/helpers/const";

/**
 * JWT to create authentication tokens
 */

/**
 * Creates new token
 * @param data any, the data to be encrypted in the token
 * @returns string, the token
 */
export const jwtCreate = (data: JwtPayload): Promise<string> =>
	new Promise((resolve, reject) => {
		if (
			typeof data === "undefined" ||
			data === null ||
			Object.keys(data).length === 0
		)
			reject("Please provide data from which to create token");
		else
			resolve(
				jsonwebtoken.sign(data, TOKEN_SECRET, {
					expiresIn: TOKEN_EXPIRATION,
				})
			);
	});

/**
 *
 * @param token string, the token to be verified
 * @returns string | jsonwebtoken.JwtPayload | undefined, the account data
 */
export const jwtVerify = (token: string): Promise<JwtPayload> =>
	new Promise((resolve, reject) => {
		if (!token) reject("Please login first.");
		else
			jsonwebtoken.verify(token, TOKEN_SECRET, (err, account) => {
				if (err || !account || typeof account === "string")
					reject("Invalid or expired token, please login again");
				else resolve(account);
			});
	});

export default { jwtCreate, jwtVerify };
