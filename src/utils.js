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
const failure = (err) => answer(err._message ? err._message : typeof err === "string" ? err : "An error occured");

// Returns good answer
const success = (caption, payload) => answer(caption, payload);

module.exports = { answer, success, failure };
