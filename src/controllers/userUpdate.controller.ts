import { Request, Response } from "express";
import UserUpdateService from "../services/userUpdate.service";
import logger from "./../utils/logger";
import { errorHandler } from "../handlers/error.handler";

class UserUpdateController {
	async updateRole(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const { newRole } = req.body;
			const userUpdated = await UserUpdateService.updateRole(userId, newRole);
			return res.status(200).send(userUpdated);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async updateUsername(req: Request, res: Response) {
		try {
			const { _id } = req.user;
			const { newUsername } = req.body;
			const userUpdated = await UserUpdateService.updateUsername(
				_id,
				newUsername
			);
			return res.status(200).send(userUpdated);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async updateEmail(req: Request, res: Response) {
		try {
			const { _id } = req.user;
			const { newEmail } = req.body;
			const userUpdated = await UserUpdateService.updateEmail(_id, newEmail);
			return res.status(200).send(userUpdated);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async updatePassword(req: Request, res: Response) {
		try {
			const { _id } = req.user;
			const { oldPassword, newPassword } = req.body;
			const userUpdated = await UserUpdateService.updatePassword(
				_id,
				oldPassword,
				newPassword
			);
			return res.status(200).send(userUpdated);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async updateAvatar(req: Request, res: Response) {
		try {
			const userUpdated = await UserUpdateService.updateAvatar(
				req.user,
				req.files
			);
			return res.status(200).send(userUpdated);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}
}

export default new UserUpdateController();
