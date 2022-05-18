import { Request, Response } from "express";
import UserService from "../services/user.service";
import CookieService from "../services/cookie.service";
import logger from "../utils/logger";
import { errorHandler } from "../handlers/error.handler";

class AuthController {
	async signup(req: Request, res: Response) {
		try {
			const input = req.body;
			const user = await UserService.signup(input);
			CookieService.setRefreshToken(res, user.refreshToken);
			return res.status(200).send(user);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async signin(req: Request, res: Response) {
		try {
			const input = req.body;
			const user = await UserService.signin(input);
			CookieService.setRefreshToken(res, user.refreshToken);
			return res.status(200).send(user);
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async logout(req: Request, res: Response) {
		try {
			const { REFRESH_TOKEN } = req.cookies;
			if (!REFRESH_TOKEN) return res.status(200).send("Token isn't exsist");
			await UserService.logout(REFRESH_TOKEN);
			req.logout();
			CookieService.deleteRefreshToken(res);
			return res.status(200).send("You success logout");
		} catch (err: any) {
			logger.error(err);
			return res.status(500).send(errorHandler(err.message));
		}
	}

	async siginSocialSuccess(req: Request, res: Response) {
		/**
		 * * all logic in passport.google.ts,
		 * * where user(in passport.google.ts) => req.user
		 */
		CookieService.setRefreshToken(res, req.user.refreshToken);
		return res.status(200).send(req.user);
	}
}

export default new AuthController();
