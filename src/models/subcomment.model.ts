import { Schema, model, Types } from "mongoose";
import { NameModel } from "../types/nameModels.type";
import { ISubcommentModel } from "../types/subcomment.type";

const subcomment = new Schema<ISubcommentModel>(
	{
		commentId: {
			type: Types.ObjectId,
			ref: NameModel.COMMENTS
		},
		userId: {
			type: Types.ObjectId,
			ref: NameModel.USERS
		},
		subcomment: {
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

const SubcommentModel = model<ISubcommentModel>(
	NameModel.SUBCOMMENTS,
	subcomment
);

export default SubcommentModel;
