import { Request, Response } from "express";
import SubcommentService from "./../services/subcomment.service";
import { errorHandler } from "../handlers/error.handler";
import logger from "../utils/logger";
import { queryHandler } from "../handlers/query.handler";
import { IPaginationQuery } from "../types/pagination.type";

class SubcommentController {
	async getSubcomments(req: Request, res: Response) {
		try {
			const { commentId } = req.params;
			const query: IPaginationQuery = req.query;
			const { limit, page } = queryHandler({
				limit: query.limit,
				page: query.page
			});

			const comments = await SubcommentService.getSubcomments(
				commentId,
				limit,
				page
			);
			return res.status(200).send({ page, limit, ...comments });
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async createSubcomment(req: Request, res: Response) {
		try {
			const { commentId, subcomment } = req.body;
			const { _id: userId } = req.user;
			const newSubcomment = await SubcommentService.createSubcomment(
				commentId,
				userId,
				subcomment
			);
			return res.status(200).send(newSubcomment);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async updateSubcomment(req: Request, res: Response) {
		try {
			const { subcomment } = req.body;
			const { id } = req.params;

			const updatedComment = await SubcommentService.updateSubcomment(
				id,
				subcomment
			);
			if (!updatedComment)
				return res.status(404).send(errorHandler("Subcomment wasn't found"));
			return res.status(200).send(updatedComment);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async deleteSubcomment(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await SubcommentService.deleteSubcomment(id);
			return res.status(200).send(`Subcomment ${id} was success deleted`);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async like(req: Request, res: Response) {
		try {
			const { _id: userId } = req.user;
			const { itemId } = req.params;
			const { rating } = req.body;
			const likedSubcomment = await SubcommentService.like(
				userId,
				itemId,
				rating
			);
			if (!likedSubcomment)
				return res.status(404).send(errorHandler("Subcomment wasn't found"));
			return res.status(200).send(likedSubcomment);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}
}

export default new SubcommentController();
