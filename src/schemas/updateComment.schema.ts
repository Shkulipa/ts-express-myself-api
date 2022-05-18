import { object } from "zod";
import SchemaService from "../services/schema.service";

const updateComment = object({
	body: object({
		comment: SchemaService.comment()
	}),
	params: SchemaService.validIdParam("id")
});

export default updateComment;
