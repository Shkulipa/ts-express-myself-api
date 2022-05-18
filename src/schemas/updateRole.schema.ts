import { Types } from "mongoose";
import { object, string } from "zod";
import Roles from "../types/roles.type";

const avaibleRoles = (() => {
	const roles = [];
	for (const role in Roles) {
		roles.push(role.toUpperCase());
	}
	return roles;
})();

const updateRole = object({
	body: object({
		newRole: string({
			required_error: "newRole is required"
		}).refine(newRole => avaibleRoles.includes(newRole.toUpperCase()), {
			message: `You should provide the role avaible from: ${avaibleRoles.join(
				", "
			)}`
		})
	}),
	params: object({
		userId: string({
			required_error: "userId is required like param"
		}).refine(userId => Types.ObjectId.isValid(userId), {
			message: "Please provide a valid user id"
		})
	})
});

export default updateRole;
