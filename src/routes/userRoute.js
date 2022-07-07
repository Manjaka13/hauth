const router = require("express").Router();
const user = require("../controllers/userController");
const { isLoggedIn, isMaster } = require("../middlewares/authMiddleware");

/*
    User user routes
*/

router.get("/get", isLoggedIn, isMaster, user.get);
router.post("/create", user.create);
router.put("/update/:id", isLoggedIn, user.update);
router.delete("/delete/:id", isLoggedIn, isMaster, user.delete);

module.exports = { path: "/user", router };
