type type = string | number;

export interface IQuery {
	limit?: type;
	page?: type;
}

export interface IParsedQuery {
	limit: number;
	page: number;
}
