import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { errorHandler } from "../handlers/error.handler";

const validation =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params
			});
			next();
		} catch (err) {
			return res.status(400).send(errorHandler(err));
		}
	};

export default validation;
