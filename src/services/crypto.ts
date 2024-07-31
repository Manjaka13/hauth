import bcrypt from "bcrypt";
import { HASH_SALT_ROUNDS } from "@/helpers/const";

/**
 * Various crypting functions
 */

/**
 * Hashes strings
 * @param password The password to be hashed
 * @returns the hashed password
 */
export const hashPassword = (password: string) =>
	bcrypt.hash(password, HASH_SALT_ROUNDS);

/**
 *
 * @param password The untouched password
 * @param hashedPassword The hashed version
 * @returns boolean
 */
export const matchPassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => bcrypt.compare(password, hashedPassword);
