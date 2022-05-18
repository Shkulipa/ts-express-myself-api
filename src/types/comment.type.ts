import { Types } from "mongoose";
import { IUser } from "./user.type";
import { IPost } from "./post.type";

export enum ICommentKeys {
	postId = "postId",
	userId = "userId",
	likes = "likes",
	createdAt = "createdAt",
	comment = "comment"
}

export interface IComment {
	_id: Types.ObjectId;
	postId: IPost | string;
	userId: IUser | string;
	comment: string;
	likes: number;
	dislikes: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICommentModel extends Document, IComment {}

export interface ICommentInput {
	comment: string;
}
