import { object } from "zod";
import SchemaService from "./../services/schema.service";

const updateEmail = object({
	body: object({
		newEmail: SchemaService.email()
	})
});

export default updateEmail;
