import { Request, Response } from "express";
import PostService from "../services/post.service";
import { IPaginationQuery } from "../types/pagination.type";
import logger from "../utils/logger";
import { errorHandler } from "../handlers/error.handler";
import { queryHandler } from "../handlers/query.handler";

class PostController {
	async getAllPosts(req: Request, res: Response) {
		try {
			const query: IPaginationQuery = req.query;
			const { limit, page } = queryHandler({
				limit: query.limit,
				page: query.page
			});

			const posts = await PostService.getAllPosts(limit, page);
			return res.status(200).send({ page, limit, ...posts });
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async getPostById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const post = await PostService.getAPostById(id);
			if (!post) return res.status(404).send(errorHandler("Post wasn't found"));
			return res.status(200).send(post);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async addPost(req: Request, res: Response) {
		try {
			const post = await PostService.addPost(req.body, req.user, req.files);
			return res.status(200).send(post);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async deletePost(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await PostService.deletePost(id);
			return res.status(200).send(`Post ${id} was success deleted`);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async updatePost(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const post = await PostService.updatePost(req.body, id);
			return res.status(200).send(post);
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
			const post = await PostService.like(userId, itemId, rating);
			return res.status(200).send(post);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}
}

export default new PostController();
