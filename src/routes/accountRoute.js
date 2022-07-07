const router = require("express").Router();
const account = require("../controllers/accountController");

/*
    Account routes
*/

router.get("/", account.get);
router.post("/create", account.create);
router.put("/:id", account.update);
router.delete("/:id", account.delete);

module.exports = { path: "/account", router };
