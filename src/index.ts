// Get env
import dotenv from "dotenv";
dotenv.config();
import Express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { SERVER_PORT } from "@/helpers/const";
import accountRoute from "@/routes/account";
import { notFoundCheck } from "@/middlewares/notFoundCheck";
import { getLoggedAccount, mustNotBanned } from "@/middlewares/auth";

/**
 * Server main entry
 */

// Setup server
const app = Express();

// Apply middlewares
app.use(cors());
app.use(cookieParser());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(getLoggedAccount);
app.use(mustNotBanned);

// Setup routes
app.use("/api/v1" + accountRoute.path, accountRoute.router);
app.use(notFoundCheck);

// Awaiting for incoming request
app.listen(SERVER_PORT, () => {
	console.log(`HAuth running on port ${SERVER_PORT}`);
});
