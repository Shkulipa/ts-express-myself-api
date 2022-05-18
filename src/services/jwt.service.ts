import jwt from "jsonwebtoken";
import { IJwtTokens, IJtwData } from "../types/jwt.type";
import { IUserModel } from "../types/user.type";
import logger from "../utils/logger";

class Jwt {
	verifyJwtToken(token: string, secretKey: string) {
		try {
			const decoded = jwt.verify(token, secretKey);

			return {
				decoded,
				expired: false
			};
		} catch (err: any) {
			logger.error(err);
			return { decoded: {}, err, expired: true };
		}
	}

	createToken(
		jwtData: IUserModel | IJtwData,
		secret: string,
		expiresIn: string
	): string {
		return jwt.sign(jwtData, secret, {
			expiresIn
		});
	}

	async createTokens(jwtData: IJtwData): Promise<IJwtTokens> {
		if (!process.env.SECRET_ACCESS_TOKEN)
			throw new Error(
				"You need to create SECRET_ACCESS_TOKEN variable in .env file"
			);
		if (!process.env.EXPIRES_ACCESS)
			throw new Error(
				"You need to create EXPIRES_ACCESS variable in .env file"
			);

		if (!process.env.SECRET_REFRESH_TOKEN)
			throw new Error(
				"You need to create SECRET_REFRESH_TOKEN variable in .env file"
			);
		if (!process.env.EXPIRES_REFRESH)
			throw new Error(
				"You need to create EXPIRES_REFRESH variable in .env file"
			);

		const accessToken = this.createToken(
			jwtData,
			process.env.SECRET_ACCESS_TOKEN,
			process.env.EXPIRES_ACCESS
		);
		const refreshToken = this.createToken(
			jwtData,
			process.env.SECRET_REFRESH_TOKEN,
			process.env.EXPIRES_REFRESH
		);

		return { accessToken, refreshToken };
	}
}

export default new Jwt();
