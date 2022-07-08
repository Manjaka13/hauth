const router = require("express").Router();
const Auth = require("../controllers/authController");

/*
    Authentication routes
*/

router.post("/login", Auth.login);
router.post("/verify", Auth.verify);

module.exports = { path: "/", router };
