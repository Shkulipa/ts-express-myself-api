import { Types } from "mongoose";
import CommentModel from "../models/comment.model";
import PostModel from "../models/post.model";
import RatingCommentModel from "../models/ratingComment.model";
import { ICommentKeys } from "../types/comment.type";
import { IUserKeys } from "../types/user.type";
import logger from "../utils/logger";

class CommentService {
	async getComments(postId: string, limit: number, page: number) {
		try {
			const comments = await CommentModel.find({
				postId: new Types.ObjectId(postId)
			})
				.sort([[ICommentKeys.likes], [ICommentKeys.createdAt]])
				.skip(limit * page - limit)
				.limit(limit)
				.populate([
					{
						path: ICommentKeys.userId,
						select: [IUserKeys._id, IUserKeys.username, IUserKeys.avatar]
					}
				]);
			const count = await CommentModel.find({
				postId: new Types.ObjectId(postId)
			}).count();

			return { comments, count };
		} catch (err: any) {
			throw new Error(err);
		}
	}

	async createComment(postId: string, userId: string, comment: string) {
		try {
			const postExist = await PostModel.findById(postId);
			if (!postExist) throw new Error("Post doesn't exsist");

			const newComment = await (
				await CommentModel.create({ postId, userId, comment })
			).populate([
				{
					path: ICommentKeys.userId,
					select: [IUserKeys._id, IUserKeys.username, IUserKeys.avatar]
				},
				{
					path: ICommentKeys.postId
				}
			]);

			return newComment;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async updateComment(commentId: string, comment: string) {
		try {
			const updatedComment = await CommentModel.findByIdAndUpdate(
				commentId,
				{ $set: { comment } },
				{ new: true }
			).populate([
				{
					path: ICommentKeys.userId,
					select: [IUserKeys._id, IUserKeys.username, IUserKeys.avatar]
				},
				{
					path: ICommentKeys.postId
				}
			]);

			return updatedComment;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async deleteComment(id: string) {
		try {
			await CommentModel.findByIdAndDelete(id);
			await CommentModel.find({
				postId: new Types.ObjectId(id)
			});
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async like(userId: string, commentId: string, rating: boolean) {
		try {
			const comment = await CommentModel.findById(commentId);
			if (!comment) throw new Error("Comment doesn't exsist");

			const ratingComment = await RatingCommentModel.findOne({
				commentId,
				userId
			});

			/**
			 * if a person previously liked, and later clicked again on
			 * the like he had already set, we remove his rating,
			 * and the comment becomes unrated by the user
			 */
			if (ratingComment && ratingComment.rating == rating) {
				await RatingCommentModel.findOneAndDelete({ commentId, userId });

				if (rating) comment.likes = Number(comment.likes) - 1;
				else comment.dislikes = Number(comment.dislikes) - 1;
			}

			/**
			 * if a person previously liked, and later he decided to change
			 * his choice by clicking on "dislike", we change his choice
			 */
			if (ratingComment && ratingComment.rating !== rating) {
				await RatingCommentModel.findOneAndUpdate(
					{ commentId, userId },
					{ $set: { rating } }
				);

				if (rating) {
					comment.likes = Number(comment.likes) + 1;
					comment.dislikes = Number(comment.likes) - 1;
				} else {
					comment.likes = Number(comment.likes) - 1;
					comment.dislikes = Number(comment.likes) + 1;
				}
			}

			/**
			 * if the person has not rated before,
			 * and rated the comment,
			 * then we create a record in the database
			 */
			if (!ratingComment) {
				await RatingCommentModel.create({
					userId: new Types.ObjectId(userId),
					commentId: new Types.ObjectId(commentId),
					rating
				});

				if (rating) comment.likes = Number(comment.likes) + 1;
				else comment.dislikes = Number(comment.dislikes) + 1;
			}

			await comment.save();

			return comment;
		} catch (err) {
			logger.error(err);
		}
	}
}

export default new CommentService();
