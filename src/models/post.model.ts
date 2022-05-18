import { Schema, model, Types } from "mongoose";
import { IPostModel } from "./../types/post.type";
import { NameModel } from "../types/nameModels.type";

const postSchema = new Schema<IPostModel>(
	{
		userId: {
			type: Types.ObjectId,
			ref: NameModel.USERS
		},
		title: {
			type: String,
			required: true,
			trim: true
		},
		content: {
			type: String,
			required: true,
			trim: true
		},
		imagesPost: {
			type: [{ type: String }],
			default: []
		},
		likes: {
			type: Number,
			required: true,
			default: 0
		},
		dislikes: {
			type: Number,
			required: true,
			default: 0
		},
		tags: {
			type: [{ type: String, lowercase: true, trim: true }],
			default: []
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const PostModel = model<IPostModel>(NameModel.POSTS, postSchema);

export default PostModel;
