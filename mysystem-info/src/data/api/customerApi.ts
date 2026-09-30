import { httpClient } from "./httpClient";

import type {
	CustomerQuery,
	CustomersResponse,
} from "../types/customerTypes";

export const customerApi = {

	// ====================================================
	// Get customers
	// ====================================================

	getCustomers: async (
		query: CustomerQuery = {}
	): Promise<CustomersResponse> => {
		const cleanCustomerNo =
			query.customerNo
				?.trim()
				.toUpperCase() ?? "";

		const cleanCustomerName =
			query.customerName
				?.trim() ?? "";

		const page =
			query.page && query.page > 0
				? query.page
				: 1;

		const pageSize =
			Math.min(
				Math.max(
					query.pageSize ?? 50,
					1
				),
				100
			);

		const params =
			new URLSearchParams();

		if (cleanCustomerNo) {
			params.set(
				"customerNo",
				cleanCustomerNo
			);
		}

		if (cleanCustomerName) {
			params.set(
				"customerName",
				cleanCustomerName
			);
		}

		params.set(
			"page",
			page.toString()
		);

		params.set(
			"pageSize",
			pageSize.toString()
		);

		return httpClient<CustomersResponse>(
			`/api/customers?${params.toString()}`
		);
	},

	// ====================================================
	// Exact customer lookup
	// ====================================================

	getCustomerByNo: async (
		customerNo: string
	): Promise<CustomersResponse> => {
		const cleanCustomerNo =
			customerNo
				.trim()
				.toUpperCase();

		if (!cleanCustomerNo) {
			throw new Error(
				"A valid Customer No is required."
			);
		}

		const params =
			new URLSearchParams();

		params.set(
			"customerNo",
			cleanCustomerNo
		);

		return httpClient<CustomersResponse>(
			`/api/customers?${params.toString()}`
		);
	},
};

export default customerApi;