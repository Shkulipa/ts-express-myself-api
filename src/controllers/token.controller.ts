import { Request, Response } from "express";
import TokenService from "./../services/token.service";
import CookieService from "../services/cookie.service";
import { CONST } from "../types/enums.type";
import logger from "../utils/logger";
import { errorHandler } from "../handlers/error.handler";

class TokenController {
	async refresh(req: Request, res: Response) {
		try {
			const cookies = req.cookies;
			const user = await TokenService.refresh(cookies[CONST.REFRESH_TOKEN]);
			CookieService.setRefreshToken(res, user.refreshToken);
			return res.status(200).send(user);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}
}

export default new TokenController();
