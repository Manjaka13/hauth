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
router.post("/confirm", shouldBeLoggedOut, Account.confirm);
router.post("/verify", Account.verify);

module.exports = { path: "/", router };
