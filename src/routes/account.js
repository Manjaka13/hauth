const router = require("express").Router();
const jwt = require("../services/jwt");
const Account = require("../controllers/account");
const { isNotConnected } = require("../middlewares/auth")(jwt);

/*
    Account routes
*/

router.post("/create", isNotConnected, Account.create);
router.post("/create/admin", isNotConnected, Account.createAdmin);
router.post("/get/admin", Account.getAdminList);

module.exports = { path: "/", router };
