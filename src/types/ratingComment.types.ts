import { IComment } from "./comment.type";
import { IUser } from "./user.type";

export interface ICommentRating {
	_id: string;
	commentId: IComment;
	userId: IUser;
	rating: boolean;
}

export interface IPostRatingModel extends Document, ICommentRating {}
