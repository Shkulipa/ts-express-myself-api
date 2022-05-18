import { object, string } from "zod";
import SchemaService from "../services/schema.service";

const updatePassword = object({
	body: object({
		oldPassword: SchemaService.password("Old Password"),
		newPassword: SchemaService.password("New Password"),
		confirmPassword: string({
			required_error: "confirmPassword is required"
		})
	}).refine(data => data.newPassword === data.confirmPassword, {
		message: "New Passwords doesn't match"
	})
});

export default updatePassword;
