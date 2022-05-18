import { IUserModel } from "./user.type";

export enum IPostKeys {
	_id = "_id",
	userId = "userId",
	title = "title",
	content = "content",
	imagesPost = "imagesPost",
	likes = "likes",
	dislikes = "dislikes",
	comments = "comments",
	tags = "tags",
	createdAt = "createdAt",
	updatedAt = "updatedAt"
}

export interface IPost {
	_id: string;
	userId: IUserModel;
	title: string;
	content: string;
	imagesPost: string[];
	likes: number;
	dislikes: number;
	tags: string[];
	createdAt?: Date;
	updatedAt?: Date;
	_doc: IPost;
}

export interface IPostModel extends Document, IPost {}

export interface IPostInput {
	userId: string;
	title: string;
	content: string;
	tags: string;
}

export interface IPostUpdateValues {
	title?: string;
	content?: string;
	tags?: string;
}

export interface IPostWithComments {
	post: IPost;
	bestComment: unknown;
	countComments: number;
}
