import { Request, Response, NextFunction } from "express";
import PostModel from "../models/post.model";
import { IUserRequest } from "../types/user.type";
import Roles from "../types/roles.type";
import { errorHandler } from "../handlers/error.handler";
import logger from "../utils/logger";

const checkOwnerPost =
	(missCheckRoles?: Roles[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			req as IUserRequest;
			const { role, _id } = req.user;
			const { id } = req.params;

			if (missCheckRoles && missCheckRoles.includes(role)) return next();

			const post = await PostModel.findById(id);
			if (!post) return res.status(404).send(errorHandler("Post wasn't found"));
			if (post.userId.valueOf() !== _id)
				return res.status(403).send(errorHandler("You haven't permission"));

			next();
		} catch (err) {
			logger.error(err);
			return res.status(500).send(errorHandler("Sorry, something went wrong"));
		}
	};

export default checkOwnerPost;
