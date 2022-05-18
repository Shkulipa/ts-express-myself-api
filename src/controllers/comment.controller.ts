import { Request, Response } from "express";
import CommentService from "./../services/comment.service";
import { IPaginationQuery } from "../types/pagination.type";
import { errorHandler } from "../handlers/error.handler";
import logger from "../utils/logger";
import { queryHandler } from "../handlers/query.handler";

class CommentController {
	async getComments(req: Request, res: Response) {
		const { postId } = req.params;
		const query: IPaginationQuery = req.query;
		const { limit, page } = queryHandler({
			limit: query.limit,
			page: query.page
		});

		const comments = await CommentService.getComments(postId, limit, page);

		return res.status(200).send({ page, limit, ...comments });
	}

	async createComment(req: Request, res: Response) {
		try {
			const { postId, comment } = req.body;
			const { _id: userId } = req.user;
			const newComment = await CommentService.createComment(
				postId,
				userId,
				comment
			);
			return res.status(200).send(newComment);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async updatePost(req: Request, res: Response) {
		try {
			const { comment } = req.body;
			const { id } = req.params;

			const updatedComment = await CommentService.updateComment(id, comment);
			if (!updatedComment)
				return res.status(404).send(errorHandler("Comment wasn't found"));
			return res.status(200).send(updatedComment);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async deleteComment(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await CommentService.deleteComment(id);
			return res.status(200).send(`Comment ${id} was success deleted`);
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
			const likedComment = await CommentService.like(userId, itemId, rating);
			if (!likedComment)
				return res.status(404).send(errorHandler("Comment wasn't found"));
			return res.status(200).send(likedComment);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}
}

export default new CommentController();
