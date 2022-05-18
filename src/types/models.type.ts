import PostModel from "./../models/post.model";
import CommentModel from "./../models/comment.model";
import UserModel from "./../models/user.model";

type TPostModel = typeof PostModel;
type TCommentModel = typeof CommentModel;
type TUserModel = typeof UserModel;

export type Models = TPostModel | TCommentModel | TUserModel;
