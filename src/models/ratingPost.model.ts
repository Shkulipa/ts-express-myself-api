import { Schema, model, Types } from "mongoose";
import { NameModel } from "../types/nameModels.type";
import { IPostRating } from "../types/ratingPost.types";

const ratingPostSchema = new Schema<IPostRating>(
	{
		postId: {
			type: Types.ObjectId,
			ref: NameModel.POSTS
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

const RatingPostModel = model<IPostRating>(
	NameModel.POSTS_RATING,
	ratingPostSchema
);

export default RatingPostModel;
