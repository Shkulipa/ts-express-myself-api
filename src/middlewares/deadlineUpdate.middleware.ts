import { Request, Response, NextFunction } from "express";
import { IOptions } from "../types/deadlineTime.type";
import { errorHandler } from "../handlers/error.handler";
import logger from "../utils/logger";
import { parseDeadlineTimeHandler } from "../handlers/parseDeadlineTime.handler";

const deadlineUpdate =
	({ time, modelDB, name }: IOptions) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const item = await modelDB.findById(id);
			if (!item)
				return res.status(404).send(errorHandler(`${name} wasn't found`));

			const createdCommentAt = new Date(String(item.createdAt)).getTime();
			const parseTime = parseDeadlineTimeHandler(time);
			const deadlineUpdate = createdCommentAt + parseTime;

			if (Date.now() > deadlineUpdate)
				return res
					.status(406)
					.send(errorHandler("The available time for the update has expired"));

			next();
		} catch (err) {
			logger.error(err);
			return res.status(500).send(errorHandler("Sorry, something went wrong"));
		}
	};

export default deadlineUpdate;
