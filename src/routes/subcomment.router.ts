import { Router } from "express";
import SubcommentController from "../controllers/subcomment.controller";
import SubcommentModel from "../models/subcomment.model";
import checkAuth from "../middlewares/checkAuth.middleware";
import validation from "../middlewares/validation.middleware";
import deadlineUpdate from "./../middlewares/deadlineUpdate.middleware";
import checkOwnerItem from "./../middlewares/checkOwnerItem.middleware";
import addSubcomment from "../schemas/addSubcomment.schema";
import updateSubcomment from "./../schemas/updateSubcomment.schema";
import ratingSchema from "../schemas/rating.schema";
import Roles from "../types/roles.type";
import itemId from "../schemas/itemId.schema";

const subcommentRouter = Router();

subcommentRouter.get("/:commentId", SubcommentController.getSubcomments);
subcommentRouter.post(
	"/",
	[checkAuth(), validation(addSubcomment)],
	SubcommentController.createSubcomment
);
subcommentRouter.put(
	"/:id",
	[
		checkAuth(),
		validation(updateSubcomment),
		deadlineUpdate({
			time: "12h",
			modelDB: SubcommentModel,
			name: "Subcomment"
		}),
		checkOwnerItem({
			modelDB: SubcommentModel,
			name: "Subomment"
		})
	],
	SubcommentController.updateSubcomment
);
subcommentRouter.delete(
	"/:id",
	[
		checkAuth(),
		validation(itemId),
		checkOwnerItem({
			missCheckRoles: [Roles.ADMIN, Roles.MODERATOR],
			modelDB: SubcommentModel,
			name: "Subomment"
		})
	],
	SubcommentController.deleteSubcomment
);

subcommentRouter.post(
	"/like/:itemId",
	[checkAuth(), validation(ratingSchema)],
	SubcommentController.like
);

export default subcommentRouter;
