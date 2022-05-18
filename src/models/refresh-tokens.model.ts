import { Schema, model, Types } from "mongoose";
import { NameModel } from "../types/nameModels.type";
import { ITokens } from "./../types/token.type";

const refreshTokensSchema = new Schema<ITokens>(
	{
		userId: {
			type: Types.ObjectId,
			ref: NameModel.USERS
		},
		refreshToken: {
			type: String,
			required: true
		}
	},
	{ versionKey: false }
);

const RefreshTokensModel = model<ITokens>(
	NameModel.REFRESH_TOKENS,
	refreshTokensSchema
);

export default RefreshTokensModel;
