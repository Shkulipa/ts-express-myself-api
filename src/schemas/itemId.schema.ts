import { object } from "zod";
import SchemaService from "../services/schema.service";

const itemId = object({
	params: object({
		id: SchemaService.validIdParam("id")
	})
});

export default itemId;
