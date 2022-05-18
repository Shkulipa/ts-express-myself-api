import { object } from "zod";
import SchemaService from "../services/schema.service";

const updateSubcomment = object({
	body: object({
		subcomment: SchemaService.comment()
	}),
	params: SchemaService.validIdParam("id")
});

export default updateSubcomment;
