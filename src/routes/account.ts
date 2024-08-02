import Express from "express";
import Account from "@/controllers/account";
import {
	mustBeLoggedOut,
	shouldBeLoggedOut,
	mustBeLoggedIn,
	mustBeConfirmed,
	mustBeAdmin,
} from "@/middlewares/auth";

/**
 * Account routes
 */

const router = Express.Router();
router.post("/sign-up/user", mustBeLoggedOut, Account.signUp);
router.post("/sign-up/admin", mustBeLoggedOut, Account.signUpAdmin);
router.get(
	"/list/admin/:app",
	mustBeLoggedIn,
	mustBeAdmin,
	mustBeConfirmed,
	Account.getAdminList
);
router.post("/sign-in", shouldBeLoggedOut, Account.signIn);
router.post("/confirm", shouldBeLoggedOut, Account.confirm);
router.post("/verify", Account.verify);
router.put("/ban", mustBeLoggedIn, mustBeAdmin, mustBeConfirmed, Account.ban);
router.put(
	"/unban",
	mustBeLoggedIn,
	mustBeAdmin,
	mustBeConfirmed,
	Account.unban
);
router.delete(
	"/delete",
	mustBeLoggedIn,
	mustBeAdmin,
	mustBeConfirmed,
	Account.remove
);
router.put("/update", mustBeLoggedIn, mustBeConfirmed, Account.update);

export default { path: "/", router };
