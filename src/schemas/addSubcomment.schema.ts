import { Types } from "mongoose";
import { object, string } from "zod";
import SchemaService from "../services/schema.service";

const addSubcomment = object({
	body: object({
		commentId: string({
			required_error: "Comment id is required like param"
		}).refine(commentId => Types.ObjectId.isValid(commentId), {
			message: "Please provide a valid post id"
		}),
		subcomment: SchemaService.comment()
	})
});

export default addSubcomment;
