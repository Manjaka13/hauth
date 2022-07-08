const router = require("express").Router();
const User = require("../controllers/userController");
const { isLoggedIn, isMaster, isConfirmed } = require("../middlewares/authMiddleware");

/*
    User user routes
*/

router.get("/get", isLoggedIn, isMaster, isConfirmed, User.getAll);
router.post("/create", User.create);
router.put("/update", isLoggedIn, isConfirmed, User.update);
router.delete("/delete/:id", isLoggedIn, isMaster, isConfirmed, User.delete);
router.post("/confirm/:id", User.confirm);

module.exports = { path: "/user", router };
