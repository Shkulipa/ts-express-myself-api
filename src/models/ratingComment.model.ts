import { Schema, model, Types } from "mongoose";
import { NameModel } from "../types/nameModels.type";
import { ICommentRating } from "../types/ratingComment.types";

const ratingCommentSchema = new Schema<ICommentRating>(
	{
		commentId: {
			type: Types.ObjectId,
			ref: NameModel.COMMENTS
		},
		userId: {
			type: Types.ObjectId,
			ref: NameModel.USERS
		},
		rating: {
			type: Boolean,
			required: true
		}
	},
	{ versionKey: false }
);

const RatingCommentModel = model<ICommentRating>(
	NameModel.COMMENTS_RATING,
	ratingCommentSchema
);

export default RatingCommentModel;
