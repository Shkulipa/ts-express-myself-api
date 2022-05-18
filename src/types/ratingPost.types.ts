import { IPost } from "./post.type";
import { IUser } from "./user.type";

export interface IPostRating {
	_id: string;
	userId: IUser;
	postId: IPost;
	rating: boolean;
}

export interface IPostRatingModel extends Document, IPostRating {}
