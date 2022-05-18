import { Request, Response } from "express";
import SearchService from "../services/search.service";
import { IPaginationQuery } from "../types/pagination.type";
import { errorHandler } from "../handlers/error.handler";
import logger from "../utils/logger";
import { queryHandler } from "../handlers/query.handler";

class SearchController {
	async searchPost(req: Request, res: Response) {
		try {
			const { search } = req.body;
			const query: IPaginationQuery = req.query;
			const { limit, page } = queryHandler({
				limit: query.limit,
				page: query.page
			});

			const result = await SearchService.searchPost(search, page, limit);

			return res.status(200).send({ page, limit, result });
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async searchUser(req: Request, res: Response) {
		try {
			const { search } = req.body;
			const query: IPaginationQuery = req.query;
			const { limit, page } = queryHandler({
				limit: query.limit,
				page: query.page
			});

			const result = await SearchService.searchUser(search, page, limit);

			return res.status(200).send({ page, limit, result });
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async searchTags(req: Request, res: Response) {
		try {
			const { search } = req.body;
			const query: IPaginationQuery = req.query;
			const { limit, page } = queryHandler({
				limit: query.limit,
				page: query.page
			});

			const result = await SearchService.searchTags(search, page, limit);

			return res.status(200).send({ page, limit, result });
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async searchAll(req: Request, res: Response) {
		try {
			const { search } = req.body;
			const query: IPaginationQuery = req.query;
			const { limit, page } = queryHandler({
				limit: query.limit,
				page: query.page
			});

			const result = await SearchService.searchAll(search, page, limit);

			return res.status(200).send({ page, limit, result });
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}
}

export default new SearchController();
