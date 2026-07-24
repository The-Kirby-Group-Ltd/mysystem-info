export type SystemTypeReference = {
	code: string;
	description: string;
};

export type EngineerReference = {
	code: string;
	description: string;
	status: string;
	telephone: string;
	email: string;
};

export type ReferenceQuery = {
	code?: string;
	description?: string;
	page?: number;
	pageSize?: number;
};

export type PagedReferenceResponse<T> = {
	items: T[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};