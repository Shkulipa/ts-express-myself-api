import { object, string } from "zod";
import SchemaService from "./../services/schema.service";

const signin = object({
	body: object({
		/**
		 * ! SchemaService.username() can't use,
		 * ! because we should accept any charaters
		 * ! for check email && username fileds
		 */
		username: string({
			required_error: "Username is required"
		}),
		password: SchemaService.password()
	})
});

export default signin;
