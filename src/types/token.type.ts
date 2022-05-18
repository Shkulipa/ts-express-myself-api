import { IUserModel } from "./user.type";

export interface ITokens {
	userId: IUserModel;
	refreshToken: string;
}

export interface ITokensModel extends Document, ITokens {}
