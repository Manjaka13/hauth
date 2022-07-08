const router = require("express").Router();
const User = require("../controllers/userController");
const { isLoggedIn, isMaster, isConfirmed } = require("../middlewares/authMiddleware");

/*
    User user routes
*/

router.get("/get", isLoggedIn, isMaster, isConfirmed, User.getAll);
router.post("/create", User.create);
router.post("/create/admin", User.createAdmin);
router.put("/update", isLoggedIn, isConfirmed, User.update);
router.delete("/delete/:id", isLoggedIn, isMaster, isConfirmed, User.delete);
router.post("/confirm/:id", User.confirm);
router.put("/ban/:id", isLoggedIn, isMaster, isConfirmed, User.ban);
router.put("/unban/:id", isLoggedIn, isMaster, isConfirmed, User.unban);
router.post("/login", User.login);
router.post("/verify", User.verify);

module.exports = { path: "/user", router };
