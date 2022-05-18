import { Response } from "express";
import { CONST } from "../types/enums.type";

class CookieService {
	setRefreshToken(res: Response, refreshToken: string): void {
		res.cookie(CONST.REFRESH_TOKEN, refreshToken, {
			maxAge: Number(process.env.EXPIRES_REFRESH)
		});
	}

	deleteRefreshToken(res: Response): void {
		res.clearCookie(CONST.REFRESH_TOKEN);
	}
}

export default new CookieService();
