import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserSocialAuthService from "../../services/userSocialAuth.service";
import { API_VERSION } from "../../utils/const";
import { parserSocialAuth } from "../passport.parser";

/**
 * get GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET here:
 * Create Credentials -> OAuth ID client -> Web aplication
 * Where:
 * Authorized JavaScript origins: http://client.com
 * Authorized redirect URIs: http://server.com/auth/google/callback, http://client.com
 * https://console.cloud.google.com/apis/credentials?project=hr-tests-tasks
 */
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID_GOOGLE as string;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET_GOOGLE as string;

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: `${API_VERSION}/auth/google/callback`
		},
		async function (accessToken, refreshToken, profile, done) {
			try {
				const parseProfile = parserSocialAuth(profile);
				const user = await UserSocialAuthService.socialAuth(parseProfile);
				done(null, user);
			} catch (err: any) {
				done(err);
			}
		}
	)
);
