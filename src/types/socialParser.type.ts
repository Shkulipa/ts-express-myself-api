export interface ISocialProfile {
	email?: string | undefined;
	verified?: "true" | "false" | undefined;
	username: string;
	avatar?: string | undefined;
}
