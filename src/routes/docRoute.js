const router = require("express").Router();
const { documentation } = require("../helpers/const");
const { success } = require("../helpers/utils");

/*
    Route for API documentation
*/

router.get("/", (req, res) => {
    res.json(success("HAuth API documentation", documentation));
});

module.exports = { path: "/", router };
