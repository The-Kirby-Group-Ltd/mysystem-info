import { httpClient } from "./httpClient";

import type {
	CallsDashboardData,
	CallsDashboardQuery,
} from "../types/dashboardTypes";

export const dashboardApi = {
	getCallsDashboardData: async (
		query: CallsDashboardQuery
	): Promise<CallsDashboardData> => {
		const params = new URLSearchParams();

		const customerNo =
			query.customerNo.trim().toUpperCase();

		const siteId =
			query.siteId?.trim().toUpperCase() ?? "";

		if (!customerNo && !siteId) {
			throw new Error(
				"Customer No or Site ID is required."
			);
		}

		if (customerNo) {
			params.set("customerNo", customerNo);
		}

		if (siteId) {
			params.set("siteId", siteId);
		}

		params.set(
			"dataMonth",
			query.dataMonth ?? "ALL"
		);

		params.set(
			"dataYear",
			(
				query.dataYear ??
				new Date().getFullYear()
			).toString()
		);

		return httpClient<CallsDashboardData>(
			`/api/portal/dashboard/calls-dashboard?${params.toString()}`
		);
	},
};

export default dashboardApi;