import { Router } from "express";
import CommentController from "./../controllers/comment.controller";
import CommentModel from "../models/comment.model";
import checkAuth from "../middlewares/checkAuth.middleware";
import validation from "../middlewares/validation.middleware";
import deadlineUpdate from "./../middlewares/deadlineUpdate.middleware";
import addComment from "../schemas/addComment.schema";
import updateComment from "./../schemas/updateComment.schema";
import ratingSchema from "../schemas/rating.schema";
import Roles from "../types/roles.type";
import itemId from "../schemas/itemId.schema";
import checkOwnerItem from "./../middlewares/checkOwnerItem.middleware";

const commentRouter = Router();

commentRouter.get("/:postId", CommentController.getComments);
commentRouter.post(
	"/",
	[checkAuth(), validation(addComment)],
	CommentController.createComment
);
commentRouter.put(
	"/:id",
	[
		checkAuth(),
		validation(updateComment),
		deadlineUpdate({
			time: "12h",
			modelDB: CommentModel,
			name: "Comment"
		}),
		checkOwnerItem({
			modelDB: CommentModel,
			name: "Comment"
		})
	],
	CommentController.updatePost
);
commentRouter.delete(
	"/:id",
	[
		checkAuth(),
		validation(itemId),
		checkOwnerItem({
			missCheckRoles: [Roles.ADMIN, Roles.MODERATOR],
			modelDB: CommentModel,
			name: "Comment"
		})
	],
	CommentController.deleteComment
);

commentRouter.post(
	"/like/:itemId",
	[checkAuth(), validation(ratingSchema)],
	CommentController.like
);

export default commentRouter;
