import { object } from "zod";
import SchemaService from "../services/schema.service";

const recoverPasswordEmail = object({
	body: object({
		email: SchemaService.email()
	})
});

export default recoverPasswordEmail;
