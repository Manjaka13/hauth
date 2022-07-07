const router = require("express").Router();
const account = require("../controllers/accountController");

/*
    Account routes
*/

router.post("/create", account.create);
router.get("/", account.get);
router.put("/:id", account.update);
router.delete("/:id", account.delete);

module.exports = { path: "/account", router };
