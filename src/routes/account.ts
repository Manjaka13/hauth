import Express from "express";
import Account from "@/controllers/account";
import {
	mustBeLoggedOut,
	shouldBeLoggedOut,
	mustBeLoggedIn,
	mustBeMaster,
} from "@/middlewares/auth";

/**
 * Account routes
 */

const router = Express.Router();
router.post("/sign-up/user", mustBeLoggedOut, Account.signUp);
router.post("/sign-up/admin", mustBeMaster, Account.signUpAdmin);
router.get("/list/admin/:app", mustBeLoggedIn, Account.getAdminList);
router.post("/sign-in", shouldBeLoggedOut, Account.signIn);
router.post("/confirm", Account.confirm);
router.get("/verify", Account.verify);
router.put("/ban", mustBeLoggedIn, Account.ban);
router.put("/unban", mustBeLoggedIn, Account.unban);
router.delete("/delete", mustBeLoggedIn, Account.remove);
router.put("/update", mustBeLoggedIn, Account.update);
router.get("/sign-out", Account.signOut);

export default { path: "/", router };
