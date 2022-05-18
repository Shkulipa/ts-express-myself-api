import { Request, Response } from "express";
import UserService from "../services/user.service";
import EmailService from "../services/email.service";
import logger from "./../utils/logger";
import { errorHandler } from "../handlers/error.handler";

class UserController {
	async getUserById(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const user = await UserService.getUserById(userId);
			if (!user)
				return res
					.status(400)
					.send(errorHandler(`User with id:${userId} wans't found`));
			return res.status(200).send(user);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async confirmActivateEmail(req: Request, res: Response) {
		try {
			const { linkId } = req.params;
			const userUpdated = await EmailService.confirmActivateEmail(linkId);
			return res.status(200).send(userUpdated);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async resendActivateEmail(req: Request, res: Response) {
		try {
			await EmailService.resendActivateEmail(req.user);
			return res
				.status(200)
				.send(
					`An email with further instructions has been sent to ${req.user.email}`
				);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async recoverPasswordEmail(req: Request, res: Response) {
		try {
			const { email } = req.body;
			const token = await UserService.recoverPasswordEmail(email);
			return res.status(200).send({
				success: `An email with further instructions has been sent to ${email}`,
				token
			});
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async recoverPassword(req: Request, res: Response) {
		try {
			const { recoverToken } = req.params;
			const { newPassword } = req.body;
			await UserService.recoverPassword(newPassword, recoverToken);
			return res.status(200).send("Success, login with new password");
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}
}

export default new UserController();
