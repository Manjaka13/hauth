import { ServerAnswer } from "@/helpers/types";

/**
 * Makes server responses look good
 */

/**
 * Returns server result as JSON
 * @param {string} caption the caption message
 * @param {any} payload the JSON payload to return
 * @param {0 | 1} status The status of the returned payload
 * @returns ServerAnswer object
 */
export const answer = (
	caption: string,
	payload?: any,
	status?: 0 | 1
): ServerAnswer => ({
	status: status ? status : 0,
	payload: payload || undefined,
	caption,
});

/**
 * Returns catched error
 * @param {string} caption the caption message
 * @param {any} payload the JSON payload to return
 * @returns ServerAnswer object
 */
export const failure = (caption: string, payload?: any): ServerAnswer => {
	const defaultMessage = "An error occured";
	return answer(caption ? caption : defaultMessage, payload);
};

/**
 * Returns good answer
 * @param {string} caption the caption message
 * @param {any} payload the JSON payload to return
 * @returns ServerAnswer object
 */
export const success = (caption: string, payload?: any): ServerAnswer =>
	answer(caption, payload, 1);
