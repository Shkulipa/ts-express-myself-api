import Roles from "./roles.type";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export enum IUserKeys {
	_id = "id",
	email = "email",
	username = "username",
	password = "password",
	createdAt = "createdAt",
	updatedAt = "updatedAt",
	accessToken = "accessToken",
	refreshToken = "refreshToken",
	role = "role",
	avatar = "avatar",
	activateEmail = "activateEmail"
}

export interface IUser {
	_id: Types.ObjectId;
	email: string;
	username: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
	accessToken: string;
	refreshToken: string;
	role: Roles;
	avatar: string;
	activateEmail: boolean;
}

export interface IUserModel extends Document, IUser {}

export interface IUserRequest extends Request {
	user: JwtPayload;
}

export interface IUserCreate {
	email: string;
	username: string;
	password: string;
	refreshToken: string;
}

export interface IUserInput {
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
}

export interface IUserDecode {
	_id: string;
	email: string;
	username: string;
	role: string[];
	createdAt: string;
	updatedAt: string;
	activateEmail: boolean;
	iat: number;
	exp: number;
}
