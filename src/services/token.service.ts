import { Types } from "mongoose";
import { omit } from "lodash";
import Jwt from "./jwt.service";
import UserModel from "../models/user.model";
import RefreshTokensModel from "../models/refresh-tokens.model";
import { IJtwData, ITokensDecode } from "../types/jwt.type";

class TokenService {
	async refresh(token: string) {
		try {
			if (!token) throw new Error("Token wasn't provided");

			if (!process.env.SECRET_REFRESH_TOKEN)
				throw new Error(
					"Please create variable <SECRET_REFRESH_TOKEN> in your .env file"
				);

			const tokenData = Jwt.verifyJwtToken(
				token,
				process.env.SECRET_REFRESH_TOKEN
			) as ITokensDecode;

			const tokenDB = await RefreshTokensModel.findOne({
				refreshToken: token
			});

			if (!tokenDB) throw new Error("Token in DB wasn't find");

			if (tokenData.expired)
				throw new Error("Your token is expired, please login again");

			const user = await UserModel.findOne({
				_id: tokenData.decoded._id
			});
			if (!user)
				throw new Error(
					`User with email:${tokenData.decoded.email} didn't found`
				);

			const jwtData: IJtwData = {
				username: user.username,
				email: user.email,
				_id: new Types.ObjectId(user._id)
			};

			const { refreshToken, accessToken } = await Jwt.createTokens(jwtData);
			user.accessToken = accessToken;

			await RefreshTokensModel.findOneAndUpdate(
				{ userId: user._id },
				{ refreshToken }
			);

			const userRes = omit(user.toJSON(), ["password"]);
			userRes.refreshToken = refreshToken;
			userRes.accessToken = accessToken;

			return userRes;
		} catch (err: any) {
			throw new Error(err);
		}
	}
}

export default new TokenService();
