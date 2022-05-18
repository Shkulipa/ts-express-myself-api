import { object } from "zod";
import SchemaService from "../services/schema.service";

const search = object({
	body: object({
		search: SchemaService.search()
	})
});

export default search;
