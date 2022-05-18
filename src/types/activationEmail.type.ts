import { IUserModel } from "./user.type";

export enum IActivationEmailKeys {
	_id = "_id",
	userId = "userId",
	activationLink = "activationLink"
}

export interface IActivationEmail {
	userId: IUserModel;
	activationLink: string;
}
