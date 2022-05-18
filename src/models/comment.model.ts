import { Schema, model, Types } from "mongoose";
import { NameModel } from "../types/nameModels.type";
import { ICommentModel } from "../types/comment.type";

const commentSchema = new Schema<ICommentModel>(
	{
		postId: {
			type: Types.ObjectId,
			ref: NameModel.POSTS
		},
		userId: {
			type: Types.ObjectId,
			ref: NameModel.USERS
		},
		comment: {
			type: String,
			trim: true,
			required: true
		},
		likes: {
			type: Number,
			default: 0
		},
		dislikes: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true, versionKey: false }
);

const CommentModel = model<ICommentModel>(NameModel.COMMENTS, commentSchema);

export default CommentModel;
