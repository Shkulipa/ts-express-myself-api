import { Response, NextFunction, Request } from "express";
import { IUserRequest } from "./../types/user.type";
import Roles from "../types/roles.type";
import { errorHandler } from "../handlers/error.handler";

const checkRole =
	(role: Roles[]) => (req: Request, res: Response, next: NextFunction) => {
		req as IUserRequest;
		if (!role.includes(req.user.role))
			return res.status(403).send(errorHandler("You haven't permission"));

		next();
	};

export default checkRole;
