import { Types } from "mongoose";
import { omit } from "lodash";
import Jwt from "./jwt.service";
import PasswordService from "./password.service";
import UserModel from "../models/user.model";
import RefreshTokensModel from "../models/refresh-tokens.model";
import { ISocialProfile } from "../types/socialParser.type";
import logger from "../utils/logger";

class UserSocialAuthService {
	async socialAuth(user: ISocialProfile) {
		try {
			const { username, email, avatar, verified } = user;

			/**
			 * github auth can be without an email
			 */
			let userExist;
			if (email) userExist = await UserModel.findOne({ email });
			else userExist = await UserModel.findOne({ username });

			if (userExist) {
				const userData = omit(userExist.toJSON(), ["password"]);
				const { refreshToken, accessToken } = await Jwt.createTokens(userData);

				await RefreshTokensModel.updateOne(
					{ userId: new Types.ObjectId(userExist._id) },
					{ $set: { refreshToken } }
				);

				userData.refreshToken = refreshToken;
				userData.accessToken = accessToken;

				return userData;
			} else {
				if (!process.env.SECRET_DEFAULT_PASS_SOCIAL)
					throw new Error("Create <SECRET_DEFAULT_PASS_SOCIAL> in env file");
				const encryptPassword = await PasswordService.encrypt(
					process.env.SECRET_DEFAULT_PASS_SOCIAL
				);

				const newUser = await UserModel.create({
					email,
					username,
					password: encryptPassword,
					avatar,
					activateEmail: verified || false
				});

				const user = omit(newUser.toJSON(), ["password"]);
				const { refreshToken, accessToken } = await Jwt.createTokens(user);

				await RefreshTokensModel.create({
					userId: new Types.ObjectId(user._id),
					refreshToken
				});

				user.refreshToken = refreshToken;
				user.accessToken = accessToken;

				return user;
			}
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}
}

export default new UserSocialAuthService();
