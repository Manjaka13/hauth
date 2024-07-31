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
router.post("/create", mustBeLoggedOut, Account.create);
router.post("/create/admin", mustBeLoggedOut, Account.createAdmin);
router.get("/get/admin", Account.getAdminList);
router.post("/login", shouldBeLoggedOut, Account.login);
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

export default { path: "/account", router };
