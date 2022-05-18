import PostModel from "./../models/post.model";
import CommentModel from "./../models/comment.model";
import SubcommentModel from "../models/subcomment.model";

type timeNumber = number;
type timeType = "m" | "h" | "d";

/**
 * For example:
 * 5m => 5 mins
 * 2h => 2 hours
 * 3d => 3 days
 */
export type TDeadlineTime = `${timeNumber}${timeType}`;
type TModels = typeof PostModel | typeof CommentModel | typeof SubcommentModel;

export interface IOptions {
	time: TDeadlineTime;
	modelDB: TModels;
	name: string;
}
