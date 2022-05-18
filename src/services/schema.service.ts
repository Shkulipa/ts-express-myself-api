import { Types } from "mongoose";
import { string, object } from "zod";

class SchemaService {
	private usernameMax = 32;
	private usernameMin = 4;
	private passMin = 6;

	private postTitleMax = 100;
	private postContentMax = 500;
	private tagsMax = 3;

	private commentMax = 250;

	private searchMax = 50;

	username() {
		return string({
			required_error: "Username is required"
		})
			.min(
				this.usernameMin,
				`Username too long - maximum can be ${this.usernameMin} chars`
			)
			.max(
				this.usernameMax,
				`Username too long - maximum can be ${this.usernameMax} chars`
			)
			.refine(
				(val: string) => {
					/**
					 * \w = [a-z]
					 * \d = [0-9]
					 */
					const pattern = /^[\w\d._]+$/i;
					const isValid = pattern.test(val);
					return isValid;
				},
				{
					message:
						"Username can contain only chracters and number with symbol: . and _"
				}
			);
	}

	password(nameField = "Password") {
		return string({
			required_error: `${nameField} is required`
		})
			.min(this.passMin, `${nameField} too short - should be 6 chars minimum`)
			.refine((val: string) => !(val.indexOf(" ") >= 0), {
				message: `${nameField} can't contain white space`
			});
	}

	email() {
		return string({
			required_error: "Email is required"
		}).email("Email isn't valid");
	}

	validIdParam(param: string) {
		return string({
			required_error: `${param} is required like param`
		}).refine(param => Types.ObjectId.isValid(param), {
			message: `Please provide a valid ${param}`
		});
	}

	postTitle(options?: { optional?: boolean }) {
		const validate = string({
			required_error: "Title is required"
		}).max(
			this.postTitleMax,
			`Title too long - maximum can be ${this.postTitleMax} chars`
		);

		if (options && options.optional) return validate.optional();
		return validate;
	}

	postContent(options?: { optional?: boolean }) {
		const validate = string({
			required_error: "Content is required"
		}).max(
			this.postContentMax,
			`Content too long - maximum can be ${this.postContentMax} chars`
		);

		if (options && options.optional) return validate.optional();
		return validate;
	}

	postTags() {
		let parseTags: string[];

		return string()
			.refine(
				tags => {
					let isError = false;
					parseTags = JSON.parse(tags);
					if (parseTags.length > this.tagsMax) isError = true;
					return !isError;
				},
				{
					message: `You can provide ${this.tagsMax} tags maximum`
				}
			)
			.refine(
				_ => {
					let isError = false;
					for (const tag of parseTags) {
						if (tag.indexOf(" ") >= 0) isError = true;

						const pattern = /^[a-z0-9]+$/i;
						const isValid = pattern.test(tag);

						if (!isValid) isError = true;
						if (isError) break;
					}
					return !isError;
				},
				{
					message:
						"Tags can contain characters and numbers without white space and symbol"
				}
			)
			.optional();
	}

	comment() {
		return string({
			required_error: "Comment is required"
		}).max(
			this.commentMax,
			`Comment too long - maximum can be ${this.commentMax} chars`
		);
	}

	search() {
		return string({
			required_error: "Search field is required"
		}).max(
			this.searchMax,
			`Search field too long - maximum can be ${this.searchMax} chars`
		);
	}
}

export default new SchemaService();
