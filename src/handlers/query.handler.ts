import { IQuery, IParsedQuery } from "../types/query.type";

export const queryHandler = ({ limit, page }: IQuery): IParsedQuery => {
	limit ? (limit = Math.max(1, Math.round(+limit))) : (limit = 10);
	page ? (page = Math.max(1, Math.round(+page))) : (page = 1);

	return { limit, page };
};
