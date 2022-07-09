/*
    Formats server's responses
*/

const response = {
    // Returns server result as JSON
    answer: (caption, payload, status) => ({
        status:
            typeof status === "number" && (status === 1 || status === 0) ? status : 0,
        payload: payload ? payload : undefined,
        caption: typeof caption === "string" ? caption : undefined,
    }),

    // Returns catched error
    failure: (caption, payload) => {
        const defaultMessage = "An error occured";
        const err = caption?._message ? caption._message : typeof caption === "string" ? caption : defaultMessage;
        return response.answer(err, payload);
    },

    // Returns good answer
    success: (caption, payload) => response.answer(caption, payload, 1),
};

module.exports = response;
