import { Profile } from "passport-google-oauth20";
import { ISocialProfile } from "./../types/socialParser.type";

export const parserSocialAuth = (profile: Profile): ISocialProfile => {
	const username =
		profile.username ||
		profile.displayName.replace(" ", "-").toLowerCase + profile.id;

	return {
		email: profile.emails && profile.emails[0].value,
		verified: profile.emails && profile.emails[0].verified,
		username,
		avatar: profile.photos && profile.photos[0].value
	};
};
