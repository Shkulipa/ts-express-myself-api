import { Types } from "mongoose";
import { customAlphabet } from "nanoid";
import { omit } from "lodash";
import Jwt from "./jwt.service";
import EmailService from "../services/email.service";
import PasswordService from "./password.service";
import RefreshTokensModel from "../models/refresh-tokens.model";
import ActivationEmailLinksModel from "../models/activationEmailLinks.model";
import RecoverTokensModel from "../models/recover-pass-tokens.model";
import UserModel from "../models/user.model";
import { ITokensModel } from "./../types/token.type";
import { IUser, IUserInput } from "../types/user.type";
import { ISigninInput } from "../types/signin.type";
import logger from "../utils/logger";
import { alphabet, baseActivationLink } from "./../utils/const";

class UserService {
	async signup(input: IUserInput) {
		const { email, username, password } = input;

		try {
			const emailExist = await UserModel.findOne({ email });
			if (emailExist)
				throw new Error(`User with email:${email} has already exsist`);

			const usernameExist = await UserModel.findOne({ username });
			if (usernameExist)
				throw new Error(`User with username:${username} has already exsist`);

			const encryptPassword = await PasswordService.encrypt(password);
			const user = await UserModel.create({
				email,
				username,
				password: encryptPassword
			});

			const uniqueId = customAlphabet(alphabet, 16)();
			const activationLink =
				process.env.API_URL + baseActivationLink + uniqueId;
			await ActivationEmailLinksModel.create({
				userId: new Types.ObjectId(user._id),
				activationLink
			});

			await EmailService.sendActivatationMail(username, email, activationLink);

			const userData = omit(user.toJSON(), ["password"]);

			const { refreshToken, accessToken } = await Jwt.createTokens(userData);

			await RefreshTokensModel.create({
				userId: new Types.ObjectId(user._id),
				refreshToken
			});

			userData.refreshToken = refreshToken;
			userData.accessToken = accessToken;

			return userData;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async signin(input: ISigninInput) {
		const { username, password } = input;

		const user = await UserModel.findOne().or([
			{ username },
			{ email: username }
		]);
		if (!user) throw new Error("User with this email or username didn't find");

		const isCorrectPassword = await PasswordService.compare(
			password,
			user.password!
		);
		if (!isCorrectPassword) throw new Error("Password isn't correct");

		const userData = omit(user.toJSON(), ["password"]);

		const { refreshToken, accessToken } = await Jwt.createTokens(userData);

		try {
			await RefreshTokensModel.findOneAndUpdate(
				{ userId: new Types.ObjectId(user._id) },
				{ refreshToken }
			);
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}

		userData.refreshToken = refreshToken;
		userData.accessToken = accessToken;

		return userData;
	}

	async getUserById(id: string) {
		try {
			const isValidId = Types.ObjectId.isValid(id);

			let user: IUser | null;
			if (isValidId) user = await UserModel.findById(id);
			else user = await UserModel.findOne({ username: id });

			return user;
		} catch (err) {
			logger.error(err);
			throw new Error("Something went wrong while getting the user");
		}
	}

	async logout(refreshToken: string): Promise<ITokensModel | null> {
		try {
			return await RefreshTokensModel.findOneAndDelete({ refreshToken });
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async recoverPasswordEmail(email: string): Promise<string> {
		try {
			const user = await UserModel.findOne({ email });
			if (!user) throw new Error("User with this email didn't find");

			const userData = omit(user.toJSON(), ["password"]);

			if (!process.env.SECRET_RECOVER_PASS || !process.env.EXPIRES_RECOVER_PASS)
				throw new Error(
					"You need to create SECRET_RECOVER_PASS && EXPIRES_RECOVER_PASS variable in .env file"
				);

			const recoverToken = Jwt.createToken(
				userData,
				process.env.SECRET_RECOVER_PASS,
				process.env.EXPIRES_RECOVER_PASS
			);

			const existRecoverToken = await RecoverTokensModel.findOne({
				userId: new Types.ObjectId(user._id)
			});
			if (existRecoverToken) {
				await RecoverTokensModel.findOneAndUpdate(
					{ userId: new Types.ObjectId(user._id) },
					{ $set: { recoverToken } }
				);
			} else {
				await RecoverTokensModel.create({
					userId: new Types.ObjectId(user._id),
					recoverToken
				});
			}

			const recoverLink = `${process.env.CLIENT_URL}/recover-password/${recoverToken}`;

			await EmailService.sendRecoverMail(user.username, email, recoverLink);

			return recoverToken;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async recoverPassword(newPassword: string, token: string) {
		try {
			if (!process.env.SECRET_RECOVER_PASS)
				throw new Error("Please create <SECRET_RECOVER_PASS> in .env file");

			const { decoded, expired } = Jwt.verifyJwtToken(
				token,
				process.env.SECRET_RECOVER_PASS
			);
			const decodedUser = decoded as IUser;

			if (expired) throw new Error("Token is expired");

			const tokenData = await RecoverTokensModel.findOne({
				userId: decodedUser._id,
				recoverToken: token
			});
			if (!tokenData) throw new Error("Token didn't find");

			const encryptPassword = await PasswordService.encrypt(newPassword);
			await UserModel.findByIdAndUpdate(decodedUser._id, {
				$set: { password: encryptPassword }
			});

			await RecoverTokensModel.findOneAndDelete({
				userId: decodedUser._id,
				recoverToken: token
			});
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}
}

export default new UserService();
