import { object } from "zod";
import SchemaService from "./../services/schema.service";

const updateUsername = object({
	body: object({
		newUsername: SchemaService.username()
	})
});

export default updateUsername;
