import PostModel from "../models/post.model";
import UserModel from "../models/user.model";
import { IPostKeys } from "../types/post.type";
import logger from "../utils/logger";

class SearchService {
	async searchPost(search: string, page: number, limit: number) {
		try {
			const regex = new RegExp(`${search}`, "gi");

			const posts = await PostModel.find({
				$or: [{ title: { $regex: regex } }, { content: { $regex: regex } }]
			})
				.sort([[IPostKeys.likes]])
				.skip(limit * page - limit)
				.limit(limit);

			const count = await PostModel.find({
				$or: [{ title: { $regex: regex } }, { content: { $regex: regex } }]
			}).count();

			return {
				posts,
				count
			};
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async searchUser(search: string, page: number, limit: number) {
		try {
			const regex = new RegExp(`${search}`, "gi");

			const users = await UserModel.find({ username: { $regex: regex } })
				.skip(limit * page - limit)
				.limit(limit);

			const count = await UserModel.find({
				username: { $regex: regex }
			}).count();

			return {
				users,
				count
			};
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async searchTags(search: string, page: number, limit: number) {
		try {
			const regex = new RegExp(`${search}`, "gi");

			const tags = await PostModel.find({
				tags: { $regex: regex }
			})
				.sort([[IPostKeys.likes]])
				.skip(limit * page - limit)
				.limit(limit);

			const count = await PostModel.find({
				tags: { $regex: regex }
			}).count();

			return {
				tags,
				count
			};
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async searchAll(search: string, page: number, limit: number) {
		try {
			const posts = await this.searchPost(search, page, limit);
			const users = await this.searchUser(search, page, limit);
			const tags = await this.searchTags(search, page, limit);

			return {
				posts,
				users,
				tags
			};
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}
}

export default new SearchService();
