import { Router } from "express";
import UserUpdateController from "./../controllers/userUpdate.controller";
import checkFiles from "../middlewares/checkFiles.middleware";
import validation from "../middlewares/validation.middleware";
import checkAuth from "../middlewares/checkAuth.middleware";
import checkRole from "../middlewares/checkRole.middleware";
import Roles from "../types/roles.type";
import updateUsername from "../schemas/updateUsername.schema";
import updateRole from "../schemas/updateRole.schema";
import updateEmail from "../schemas/updateEmail.schema";
import updatePassword from "../schemas/updatePassword.schema";
import { imgTypes } from "./../utils/const";

const userUpdateRouter = Router();

userUpdateRouter.put(
	"/updateRole/:userId",
	[checkAuth(), checkRole([Roles.ADMIN]), validation(updateRole)],
	UserUpdateController.updateRole
);
userUpdateRouter.put(
	"/avatar",
	[checkAuth(), checkFiles(1, imgTypes, 5)],
	UserUpdateController.updateAvatar
);
userUpdateRouter.put(
	"/username",
	[checkAuth(), validation(updateUsername)],
	UserUpdateController.updateUsername
);
userUpdateRouter.put(
	"/email",
	[checkAuth(), validation(updateEmail)],
	UserUpdateController.updateEmail
);
userUpdateRouter.put(
	"/password",
	[checkAuth(), validation(updatePassword)],
	UserUpdateController.updatePassword
);

export default userUpdateRouter;
