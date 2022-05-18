import { Schema, model, Types } from "mongoose";
import { NameModel } from "../types/nameModels.type";
import { IRecoverTokenModel } from "../types/recoverPassTokens.type";

const recoverTokensSchema = new Schema<IRecoverTokenModel>(
	{
		userId: {
			type: Types.ObjectId,
			ref: NameModel.USERS
		},
		recoverToken: {
			type: String,
			required: true
		}
	},
	{ versionKey: false }
);

const RecoverTokensModel = model<IRecoverTokenModel>(
	NameModel.RECOVER_PASS_TOKENS,
	recoverTokensSchema
);

export default RecoverTokensModel;
