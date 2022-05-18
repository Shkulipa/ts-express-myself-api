import { Types } from "mongoose";
import { omit } from "lodash";
import { FileArray } from "express-fileupload";
import PasswordService from "./password.service";
import FileService from "./file.service";
import UserModel from "../models/user.model";
import Roles from "../types/roles.type";
import { IUserDecode } from "../types/user.type";

class UserUpdateService {
	async updateRole(userId: string, newRole: Roles) {
		const userExist = await UserModel.findOne({
			_id: new Types.ObjectId(userId)
		});
		if (!userExist) throw new Error(`User with id:${userId} wasn't found`);

		try {
			return await UserModel.findOneAndUpdate(
				{ _id: new Types.ObjectId(userId) },
				{ $set: { role: newRole } },
				{ new: true }
			);
		} catch (err) {
			throw new Error("something went wrong while updating the user role");
		}
	}

	async updateUsername(userId: string, newUsername: string) {
		try {
			return await UserModel.findOneAndUpdate(
				{ _id: new Types.ObjectId(userId) },
				{ $set: { username: newUsername } },
				{ new: true }
			);
		} catch (err) {
			throw new Error("Something went wrong while updating username");
		}
	}

	async updateEmail(userId: string, newEmail: string) {
		try {
			const userUpdated = await UserModel.findOneAndUpdate(
				{ _id: new Types.ObjectId(userId) },
				{ $set: { email: newEmail } },
				{ new: true }
			);

			return omit(userUpdated!.toJSON(), ["password"]);
		} catch (err) {
			throw new Error("Something went wrong while updating email");
		}
	}

	async updatePassword(
		userId: string,
		oldPassword: string,
		newPassword: string
	) {
		const user = await UserModel.findOne({ _id: new Types.ObjectId(userId) });
		if (!user) throw new Error("User wasn't find");

		const isCorrectPassword = await PasswordService.compare(
			oldPassword,
			user.password!
		);
		if (!isCorrectPassword) throw new Error("Password isn't correct");

		const encryptPassword = await PasswordService.encrypt(newPassword);

		const userUpdated = await UserModel.findOneAndUpdate(
			{ _id: new Types.ObjectId(userId) },
			{ $set: { password: encryptPassword } },
			{ new: true }
		);

		return omit(userUpdated!.toJSON(), ["password"]);
	}

	async updateAvatar(user: IUserDecode, files: FileArray | undefined) {
		try {
			if (!files) throw new Error("Please, choose the file");

			const path = `${__dirname}/../statics/images/avatars/`;
			const uploadedFiles = FileService.parseUploadFile(files.images);
			const fileName = FileService.uploadFiles(uploadedFiles, path)[0];

			return await UserModel.findOneAndUpdate(
				{ _id: new Types.ObjectId(user._id) },
				{ $set: { avatar: fileName } },
				{ new: true }
			);
		} catch (err: any) {
			throw new Error(err);
		}
	}
}

export default new UserUpdateService();
