// ====================================================
// Customer data types
// ====================================================

export type Customer = {
	customerNo: string;
	customerName: string;
	postCode: string;
};

// ====================================================
// Customer query
// ====================================================

export type CustomerQuery = {
	customerNo?: string;
	customerName?: string;

	page?: number;
	pageSize?: number;
};

// ====================================================
// Customer response
// ====================================================

export type CustomersResponse = {
	items: Customer[];

	page: number;
	pageSize: number;
	total: number;

	hasMore: boolean;
};