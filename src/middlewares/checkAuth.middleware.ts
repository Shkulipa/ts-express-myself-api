import { Request, Response, NextFunction } from "express";
import Jwt from "./../services/jwt.service";
import { errorHandler } from "../handlers/error.handler";
import logger from "../utils/logger";

const checkAuth = () => (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers.authorization)
			return res.status(401).send(errorHandler("Please login"));

		const token = req.headers.authorization.split(" ")[1];

		if (!process.env.SECRET_ACCESS_TOKEN)
			throw new Error("Please create <SECRET_ACCESS_TOKEN> in .env file");

		const { decoded, expired, err } = Jwt.verifyJwtToken(
			token,
			process.env.SECRET_ACCESS_TOKEN
		);

		if (expired) return res.status(401).send(errorHandler(err.message));

		req.user = decoded;

		next();
	} catch (err) {
		logger.error(err);
		return res.status(500).send(errorHandler("Sorry, something went wrong"));
	}
};

export default checkAuth;
