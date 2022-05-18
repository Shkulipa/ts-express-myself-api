import { Types } from "mongoose";
import { object, string } from "zod";
import SchemaService from "../services/schema.service";

const addPostComment = object({
	body: object({
		postId: string({
			required_error: "postId is required like param"
		}).refine(postId => Types.ObjectId.isValid(postId), {
			message: "Please provide a valid post id"
		}),
		comment: SchemaService.comment()
	})
});

export default addPostComment;
