import { object } from "zod";
import SchemaService from "../services/schema.service";

const getComments = object({
	params: SchemaService.validIdParam("postId")
});

export default getComments;
