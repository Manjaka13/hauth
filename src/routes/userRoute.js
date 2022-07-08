const router = require("express").Router();
const User = require("../controllers/userController");
const { isLoggedIn, isMaster } = require("../middlewares/authMiddleware");

/*
    User user routes
*/

router.get("/get", isLoggedIn, isMaster, User.getAll);
router.post("/create", User.create);
router.put("/update", isLoggedIn, User.update);
router.delete("/delete/:id", isLoggedIn, isMaster, User.delete);
router.post("/confirm/:id", User.confirm);

module.exports = { path: "/user", router };
