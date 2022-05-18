import passport from "passport";
import { Profile } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { API_VERSION } from "../../utils/const";
import { parserSocialAuth } from "../passport.parser";
import UserSocialAuthService from "../../services/userSocialAuth.service";

const GITHUB_CLIENT_ID = process.env.CLIENT_ID_GITHUB as string;
const GITHUB_CLIENT_SECRET = process.env.CLIENT_SECRET_GITHUB as string;

passport.use(
	new GithubStrategy(
		{
			clientID: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			callbackURL: `${API_VERSION}/auth/github/callback`
		},
		async function (
			accessToken: string,
			refreshToken: string,
			profile: Profile,
			done: (arg0: null, arg1: any) => void
		) {
			try {
				const parseProfile = parserSocialAuth(profile);
				const user = await UserSocialAuthService.socialAuth(parseProfile);
				done(null, user);
			} catch (err: any) {
				done(err, null);
			}
		}
	)
);
