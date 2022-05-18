import { Request, Response, NextFunction } from "express";
import { IUserRequest } from "../types/user.type";
import { errorHandler } from "../handlers/error.handler";
import logger from "../utils/logger";
import { IOptions } from "../types/checkOwnerItem.type";

/**
 * this middleware is for comment and subcomment models
 */
const checkOwnerItem =
	({ missCheckRoles, modelDB, name }: IOptions) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			req as IUserRequest;
			const { role, _id } = req.user;
			const { id } = req.params;

			if (missCheckRoles && missCheckRoles.includes(role)) return next();

			const item = await modelDB.findById(id);

			if (!item)
				return res.status(404).send(errorHandler(`${name} wasn't found`));
			if (item.userId.valueOf() !== _id)
				return res.status(403).send(errorHandler("You haven't permission"));

			next();
		} catch (err) {
			logger.error(err);
			return res.status(500).send(errorHandler("Sorry, something went wrong"));
		}
	};

export default checkOwnerItem;
