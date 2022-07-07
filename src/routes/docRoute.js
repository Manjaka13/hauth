const router = require("express").Router();
const { answer } = require("../utils");

/*
    Route for API documentation
*/

router.get("/", (req, res) => {
    res.json(answer("HAuth API documentation", [
        {
            route: "/",
            description: "Displays exhaustive list of all API routes and their parameters."
        }
    ], 1));
});

module.exports = { path: "/", router };
