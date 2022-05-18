import { Schema, model, Types } from "mongoose";
import { IActivationEmail } from "../types/activationEmail.type";
import { NameModel } from "../types/nameModels.type";

const activationEmailLinksSchema = new Schema<IActivationEmail>(
	{
		userId: {
			type: Types.ObjectId,
			ref: NameModel.USERS
		},
		activationLink: {
			type: String
		}
	},
	{ versionKey: false }
);

const activationEmailLinksModel = model<IActivationEmail>(
	NameModel.ACTIVATION_LINKS,
	activationEmailLinksSchema
);

export default activationEmailLinksModel;
