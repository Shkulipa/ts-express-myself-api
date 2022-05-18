import { Router } from "express";
import passport from "passport";
import AuthController from "../controllers/auth.controller";
import validation from "../middlewares/validation.middleware";
import signin from "../schemas/signin.schema";
import signup from "../schemas/signup.schema";
import { API_VERSION } from "./../utils/const";

const authRouter = Router();

authRouter.post("/signup", validation(signup), AuthController.signup);
authRouter.post("/signin", validation(signin), AuthController.signin);
authRouter.get(`/signin/social/success`, AuthController.siginSocialSuccess);

/**
 * Google
 */
authRouter.get(
	"/google",
	/**
	 * google scopes api:
	 * https://developers.google.com/identity/protocols/oauth2/scopes
	 */
	passport.authenticate("google", {
		scope: ["profile", "https://www.googleapis.com/auth/userinfo.email"]
	})
);
authRouter.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: `${API_VERSION}/auth/signin/social/success`,
		failureRedirect: `${API_VERSION}/auth/signin/social/failed`
	})
);

/**
 * Github
 */
authRouter.get(
	"/github",
	passport.authenticate("github", {
		scope: ["profile"]
	})
);
authRouter.get(
	"/github/callback",
	passport.authenticate("github", {
		successRedirect: `${API_VERSION}/auth/signin/social/success`,
		failureRedirect: `${API_VERSION}/auth/signin/social/failed`
	})
);

authRouter.post("/logout", AuthController.logout);

export default authRouter;
