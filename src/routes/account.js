const router = require("express").Router();
const jwt = require("../services/jwt");
const Account = require("../controllers/account");
const {
    mustBeLoggedOut,
    shouldBeLoggedOut
} = require("../middlewares/auth")(jwt);

/*
    Account routes
*/

router.post("/create", mustBeLoggedOut, Account.create);
router.post("/create/admin", mustBeLoggedOut, Account.createAdmin);
router.get("/get/admin", Account.getAdminList);
router.post("/login", shouldBeLoggedOut, Account.login);

module.exports = { path: "/", router };
