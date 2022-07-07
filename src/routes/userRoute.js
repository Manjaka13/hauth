const router = require("express").Router();
const user = require("../controllers/userController");

/*
    User user routes
*/

router.get("/", user.get);
router.post("/create", user.create);
router.put("/:id", user.update);
router.delete("/:id", user.delete);

module.exports = { path: "/user", router };
