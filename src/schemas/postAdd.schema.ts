import { object } from "zod";
import SchemaService from "../services/schema.service";

const postAdd = object({
	body: object({
		title: SchemaService.postTitle(),
		content: SchemaService.postContent(),
		tags: SchemaService.postTags()
	})
});

export default postAdd;
