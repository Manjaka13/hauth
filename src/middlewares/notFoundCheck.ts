import { failure } from "@/services/response";
import type { Request, Response } from "express";

// Handles 404 errors
export const notFoundCheck = (req: Request, res: Response) =>
	res.json(failure("Invalid route"));
