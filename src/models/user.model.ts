import { Schema, model } from "mongoose";
import { IUserModel } from "./../types/user.type";
import ROLES from "../types/roles.type";
import { NameModel } from "../types/nameModels.type";

const userSchema = new Schema<IUserModel>(
	{
		email: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true
		},
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		password: {
			type: String,
			required: true,
			trim: true
		},
		role: {
			type: String,
			required: true,
			default: ROLES.USER
		},
		avatar: {
			type: String,
			default: "",
			trim: true
		},
		activateEmail: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true, versionKey: false }
);

const UserModel = model<IUserModel>(NameModel.USERS, userSchema);

export default UserModel;
