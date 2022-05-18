import { object, string } from "zod";
import SchemaService from "./../services/schema.service";

const signup = object({
	body: object({
		username: SchemaService.username(),
		password: SchemaService.password(),
		confirmPassword: string({
			required_error: "confirmPassword is required"
		}),
		email: SchemaService.email()
	}).refine(data => data.password === data.confirmPassword, {
		message: "Passwords doesn't match"
	})
});

export default signup;
