import { Types } from "mongoose";
import CommentModel from "../models/comment.model";
import RatingCommentModel from "../models/ratingComment.model";
import SubcommentModel from "./../models/subcomment.model";
import { ICommentKeys } from "../types/comment.type";
import { IUserKeys } from "../types/user.type";
import logger from "../utils/logger";
import { ISubcommentKeys } from "../types/subcomment.type";

class SubcommentService {
	async getSubcomments(commentsId: string, limit: number, page: number) {
		try {
			const subcomments = await SubcommentModel.find({
				commentsId: new Types.ObjectId(commentsId)
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
			const count = await SubcommentModel.find({
				commentsId: new Types.ObjectId(commentsId)
			}).count();

			return { subcomments, count };
		} catch (err: any) {
			throw new Error(err);
		}
	}

	async createSubcomment(
		commentId: string,
		userId: string,
		subcomment: string
	) {
		try {
			const commentExist = await CommentModel.findById(commentId);
			if (!commentExist) throw new Error("Comment doesn't exsist");

			const newSubcomment = await (
				await SubcommentModel.create({ commentId, userId, subcomment })
			).populate([
				{
					path: ICommentKeys.userId,
					select: [IUserKeys._id, IUserKeys.username, IUserKeys.avatar]
				},
				{
					path: ISubcommentKeys.commentId
				}
			]);

			return newSubcomment;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async updateSubcomment(subcommentId: string, subcomment: string) {
		try {
			const updatedSubcomment = await SubcommentModel.findByIdAndUpdate(
				subcommentId,
				{ $set: { subcomment } },
				{ new: true }
			).populate([
				{
					path: ICommentKeys.userId,
					select: [IUserKeys._id, IUserKeys.username, IUserKeys.avatar]
				},
				{
					path: ISubcommentKeys.commentId
				}
			]);

			return updatedSubcomment;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async deleteSubcomment(id: string) {
		try {
			return await SubcommentModel.findByIdAndDelete(id);
		} catch (err: any) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async like(userId: string, subcommentId: string, rating: boolean) {
		try {
			const subcomment = await SubcommentModel.findById(subcommentId);
			if (!subcomment) throw new Error("Subcomment doesn't exsist");

			const ratingSubcomment = await RatingCommentModel.findOne({
				subcommentId,
				userId
			});

			/**
			 * if a person previously liked, and later clicked again on
			 * the like he had already set, we remove his rating,
			 * and the comment becomes unrated by the user
			 */
			if (ratingSubcomment && ratingSubcomment.rating == rating) {
				await RatingCommentModel.findOneAndDelete({ subcommentId, userId });

				if (rating) subcomment.likes = Number(subcomment.likes) - 1;
				else subcomment.dislikes = Number(subcomment.dislikes) - 1;
			}

			/**
			 * if a person previously liked, and later he decided to change
			 * his choice by clicking on "dislike", we change his choice
			 */
			if (ratingSubcomment && ratingSubcomment.rating !== rating) {
				await RatingCommentModel.findOneAndUpdate(
					{ subcommentId, userId },
					{ $set: { rating } }
				);

				if (rating) {
					subcomment.likes = Number(subcomment.likes) + 1;
					subcomment.dislikes = Number(subcomment.likes) - 1;
				} else {
					subcomment.likes = Number(subcomment.likes) - 1;
					subcomment.dislikes = Number(subcomment.likes) + 1;
				}
			}

			/**
			 * if the person has not rated before,
			 * and rated the comment,
			 * then we create a record in the database
			 */
			if (!ratingSubcomment) {
				await RatingCommentModel.create({
					userId: new Types.ObjectId(userId),
					commentId: new Types.ObjectId(subcommentId),
					rating
				});

				if (rating) subcomment.likes = Number(subcomment.likes) + 1;
				else subcomment.dislikes = Number(subcomment.dislikes) + 1;
			}

			await subcomment.save();

			return subcomment;
		} catch (err) {
			logger.error(err);
		}
	}
}

export default new SubcommentService();
