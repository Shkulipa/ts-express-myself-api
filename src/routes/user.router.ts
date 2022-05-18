import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import checkAuth from "../middlewares/checkAuth.middleware";
import UserController from "./../controllers/user.controller";
import recoverPasswordEmail from "../schemas/recoverPasswordEmail.schema";
import recoverPasswords from "../schemas/recoverPasswords.schema";

const userRouter = Router();

userRouter.get("/:userId", UserController.getUserById);

/**
 * Email activate/confirm
 */
userRouter.get(
	"/resend-activate-email",
	checkAuth(),
	UserController.resendActivateEmail
);
userRouter.get(
	"/confirm-activate-email/:linkId",
	UserController.confirmActivateEmail
);

/**
 * Recover Password
 */
userRouter.post(
	"/recover-password-email",
	validation(recoverPasswordEmail),
	UserController.recoverPasswordEmail
);
userRouter.post(
	"/recover-password/:recoverToken",
	validation(recoverPasswords),
	UserController.recoverPassword
);

export default userRouter;
