import { IComment, ICommentKeys } from "./comment.type";

export enum ISubcommentKeys {
	commentId = "commentId",
	userId = "userId",
	likes = "likes",
	createdAt = "createdAt"
}

export interface ISubomment
	extends Omit<IComment, ICommentKeys.postId | ICommentKeys.comment> {
	commentId: IComment | string;
	subcomment: string;
}

export interface ISubcommentModel extends Document, ISubomment {}
