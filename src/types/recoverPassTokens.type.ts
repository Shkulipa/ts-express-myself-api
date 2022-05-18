import { IUserModel } from "./user.type";

export interface IRecoverTokenModel {
	userId: IUserModel;
	recoverToken: string;
}
