import { Types } from "mongoose";
import { FileArray } from "express-fileupload";
import FileService from "./file.service";
import CommentModel from "../models/comment.model";
import RatingPostModel from "../models/ratingPost.model";
import PostModel from "../models/post.model";
import {
	IPostInput,
	IPostKeys,
	IPostUpdateValues,
	IPostWithComments
} from "./../types/post.type";
import { IUserDecode, IUserKeys } from "../types/user.type";
import { ICommentKeys } from "./../types/comment.type";
import logger from "../utils/logger";
import SubcommentModel from "../models/subcomment.model";

class PostService {
	async getAllPosts(limit: number, page: number) {
		try {
			const posts = await PostModel.find()
				.sort("createdAt")
				.skip(limit * page - limit)
				.limit(limit);
			const count = await PostModel.find().count();

			const postWithComments: IPostWithComments[] = [];
			for (const post of posts) {
				const bestComment = await CommentModel.find({
					postId: new Types.ObjectId(post._id)
				})
					.sort([[ICommentKeys.likes, -1]])
					.limit(1)
					.populate([
						{
							path: ICommentKeys.userId,
							select: [IUserKeys._id, IUserKeys.username, IUserKeys.avatar]
						}
					]);

				const countComments = await CommentModel.find({
					postId: new Types.ObjectId(post._id)
				}).count();
				postWithComments.unshift({
					post: post._doc,
					bestComment,
					countComments
				});
			}

			return { postWithComments, count };
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async getAPostById(id: string) {
		try {
			return await PostModel.findOne({ _id: new Types.ObjectId(id) });
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async addPost(
		input: IPostInput,
		user: IUserDecode,
		files: FileArray | undefined
	) {
		try {
			let filesName: string[] = [];
			if (files && files.images) {
				const path = `${__dirname}/../statics/images/posts/`;
				const uploadedFiles = FileService.parseUploadFile(files.images);
				filesName = FileService.uploadFiles(uploadedFiles, path);
			}

			const post = await (
				await PostModel.create({
					...input,
					tags: JSON.parse(input.tags),
					imagesPost: filesName,
					userId: new Types.ObjectId(user._id)
				})
			).populate({
				path: IPostKeys.userId,
				select: [
					IUserKeys.email,
					IUserKeys.username,
					IUserKeys._id,
					IUserKeys.avatar
				]
			});

			return post;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async updatePost(input: IPostUpdateValues, postId: string) {
		try {
			const newValues: IPostUpdateValues = {};
			if (input.title) newValues.title = input.title;
			if (input.content) newValues.content = input.content;
			if (input.tags) newValues.tags = JSON.parse(input.tags);

			const post = await PostModel.findByIdAndUpdate(
				postId,
				{
					$set: { ...newValues }
				},
				{ new: true }
			);

			return post;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async deletePost(id: string): Promise<void> {
		try {
			const post = await PostModel.findById(id);
			if (!post) throw new Error("Post dosen't exist");

			if (post.imagesPost.length > 0) {
				const pathFolder = __dirname + "/../statics/images/posts/";
				post.imagesPost.forEach(imgName =>
					FileService.deleteFile(pathFolder + imgName)
				);
			}

			await PostModel.findByIdAndDelete(id);
			const comments = await CommentModel.find({
				postId: new Types.ObjectId(id)
			});
			comments.forEach(
				async ({ _id }) =>
					await SubcommentModel.deleteMany({
						commentId: new Types.ObjectId(_id)
					})
			);
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async like(userId: string, postId: string, rating: boolean) {
		try {
			const post = await PostModel.findById(postId);
			if (!post) throw new Error("Post doesn't exsist");

			const ratingPost = await RatingPostModel.findOne({ postId, userId });

			/**
			 * if a person previously liked, and later clicked again on
			 * the like he had already set, we remove his rating,
			 * and the post becomes unrated by the user
			 */
			if (ratingPost && ratingPost.rating == rating) {
				await RatingPostModel.findOneAndDelete({ postId, userId });

				if (rating) post.likes = Number(post.likes) - 1;
				else post.dislikes = Number(post.dislikes) - 1;
			}

			/**
			 * if a person previously liked, and later he decided to change
			 * his choice by clicking on "dislike", we change his choice
			 */
			if (ratingPost && ratingPost.rating !== rating) {
				await RatingPostModel.findOneAndUpdate(
					{ postId, userId },
					{ $set: { rating } }
				);

				if (rating) {
					post.likes = Number(post.likes) + 1;
					post.dislikes = Number(post.likes) - 1;
				} else {
					post.likes = Number(post.likes) - 1;
					post.dislikes = Number(post.likes) + 1;
				}
			}

			/**
			 * if the person has not rated before,
			 * and rated the post,
			 * then we create a record in the database
			 */
			if (!ratingPost) {
				await RatingPostModel.create({
					userId: new Types.ObjectId(userId),
					postId: new Types.ObjectId(postId),
					rating
				});

				if (rating) post.likes = Number(post.likes) + 1;
				else post.dislikes = Number(post.dislikes) + 1;
			}

			await post.save();

			return post;
		} catch (err) {
			logger.error(err);
		}
	}
}

export default new PostService();
