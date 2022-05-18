import { Router } from "express";
import PostController from "../controllers/post.controller";
import checkAuth from "../middlewares/checkAuth.middleware";
import checkFiles from "../middlewares/checkFiles.middleware";
import checkOwnerPost from "../middlewares/checkOwnerPost.middleware";
import validation from "../middlewares/validation.middleware";
import deadlineUpdate from "./../middlewares/deadlineUpdate.middleware";
import PostModel from "../models/post.model";
import postAdd from "../schemas/postAdd.schema";
import updatePost from "../schemas/updatePost.schema";
import ratingSchema from "../schemas/rating.schema";
import itemId from "../schemas/itemId.schema";
import Roles from "../types/roles.type";
import { imgTypes } from "../utils/const";

const postRouter = Router();

postRouter.get("/", PostController.getAllPosts);
postRouter.get("/:id", validation(itemId), PostController.getPostById);

postRouter.post(
	"/",
	[checkAuth(), validation(postAdd), checkFiles(3, imgTypes, 5)],
	PostController.addPost
);

postRouter.put(
	"/:id",
	[
		checkAuth(),
		validation(updatePost),
		deadlineUpdate({
			time: "12h",
			modelDB: PostModel,
			name: "Post"
		}),
		checkOwnerPost()
	],
	PostController.updatePost
);

postRouter.delete(
	"/:id",
	[
		checkAuth(),
		validation(itemId),
		checkOwnerPost([Roles.ADMIN, Roles.MODERATOR])
	],
	PostController.deletePost
);

postRouter.post(
	"/like/:itemId",
	[checkAuth(), validation(ratingSchema)],
	PostController.like
);

export default postRouter;
