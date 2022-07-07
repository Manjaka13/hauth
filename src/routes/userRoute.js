const router = require("express").Router();
const user = require("../controllers/userController");

/*
    User user routes
*/

router.get("/get", user.get);
router.post("/create", user.create);
router.put("/update/:id", user.update);
router.delete("/delete/:id", user.delete);

module.exports = { path: "/user", router };
