import { object, string } from "zod";
import SchemaService from "../services/schema.service";

const recoverPasswords = object({
	body: object({
		newPassword: SchemaService.password(),
		confirmPassword: string({
			required_error: "confirmPassword is required"
		})
	}).refine(data => data.newPassword === data.confirmPassword, {
		message: "Passwords doesn't match"
	})
});

export default recoverPasswords;
