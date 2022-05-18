import CommentModel from "../models/comment.model";
import SubcommentModel from "../models/subcomment.model";
import Roles from "./roles.type";

type TModels = typeof CommentModel | typeof SubcommentModel;

export interface IOptions {
	missCheckRoles?: Roles[];
	modelDB: TModels;
	name: string;
}
