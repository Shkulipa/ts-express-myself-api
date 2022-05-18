import { Types } from "mongoose";
import { boolean, object, string } from "zod";

const ratingSchema = object({
	body: object({
		rating: boolean({
			required_error: "Rating is required"
		})
	}),
	params: object({
		itemId: string({
			required_error: "ItemId is required like param"
		}).refine(itemId => Types.ObjectId.isValid(itemId), {
			message: "Please provide a valid id"
		})
	})
});

export default ratingSchema;
