const router = require("express").Router();
const auth = require("../controllers/authController");

/*
    Authentication routes
*/

router.post("/login", auth.login);

module.exports = { path: "/", router };
