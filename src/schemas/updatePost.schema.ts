import { object } from "zod";
import SchemaService from "../services/schema.service";

const postUpdate = object({
	body: object({
		title: SchemaService.postTitle({ optional: true }),
		content: SchemaService.postContent({ optional: true }),
		tags: SchemaService.postTags()
	}),
	params: SchemaService.validIdParam("id")
});

export default postUpdate;
