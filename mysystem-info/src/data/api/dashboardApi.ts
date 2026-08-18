import { httpClient } from "./httpClient";

import type {
	CallsDashboardData,
	CallsDashboardQuery,
	DashboardCallsItemsQuery,
	DashboardCallsItemsResponse,
	MaintenanceDashboardQuery,
	MaintenanceDashboardData,
	DashboardMaintenanceItemsQuery,
	DashboardMaintenanceItemsResponse,
} from "../types/dashboardTypes";

export const dashboardApi = {
	// =====================================================
	// Calls dashboard summary
	// =====================================================

	getCallsDashboardData: async (
		query: CallsDashboardQuery
	): Promise<CallsDashboardData> => {
		const params = new URLSearchParams();

		const customerNo =
			query.customerNo
				.trim()
				.toUpperCase();

		const siteId =
			query.siteId
				?.trim()
				.toUpperCase() ?? "";

		if (!customerNo && !siteId) {
			throw new Error(
				"Customer No or Site ID is required."
			);
		}

		if (customerNo) {
			params.set(
				"customerNo",
				customerNo
			);
		}

		if (siteId) {
			params.set(
				"siteId",
				siteId
			);
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

	// =====================================================
	// Calls dashboard support records
	// =====================================================

	getCallsDashboardItems: async (
		query: DashboardCallsItemsQuery
	): Promise<DashboardCallsItemsResponse> => {
		const params =
			new URLSearchParams();

		const customerNo =
			query.customerNo
				.trim()
				.toUpperCase();

		const siteId =
			query.siteId
				?.trim()
				.toUpperCase() ?? "";

		const filterValue =
			query.filterValue
				?.trim()
				.toUpperCase() ?? "";

		if (!customerNo && !siteId) {
			throw new Error(
				"Customer No or Site ID is required."
			);
		}

		if (customerNo) {
			params.set(
				"customerNo",
				customerNo
			);
		}

		if (siteId) {
			params.set(
				"siteId",
				siteId
			);
		}

		params.set(
			"dataMonth",
			query.dataMonth
		);

		params.set(
			"dataYear",
			query.dataYear.toString()
		);

		params.set(
			"filterType",
			query.filterType
		);

		if (filterValue) {
			params.set(
				"filterValue",
				filterValue
			);
		}

		params.set(
			"page",
			Math.max(
				query.page ?? 1,
				1
			).toString()
		);

		params.set(
			"pageSize",
			Math.min(
				Math.max(
					query.pageSize ?? 30,
					1
				),
				30
			).toString()
		);

		return httpClient<DashboardCallsItemsResponse>(
			`/api/portal/dashboard/calls-dashboard/items?${params.toString()}`
		);
	},

	// =====================================================
	// Maintenance dashboard summary
	// =====================================================

	getMaintenanceDashboardData: async (
		query: MaintenanceDashboardQuery,
	): Promise<MaintenanceDashboardData> => {
		const params = new URLSearchParams();

		// get customer/site from query

		const customerNo = 
			query.customerNo
				.trim()
				.toUpperCase() ?? "";

		const siteId =
			query.siteId
				?.trim()
				.toUpperCase() ?? "";

		// validate customer/site exist

		if (!customerNo && !siteId) {
			throw new Error(
				"Customer No or Site ID is required."
			);
		}

		// add to params

		if (customerNo) {
			params.set(
				"customerNo",
				customerNo
			)
		}
		
		if (siteId) {
			params.set(
				"siteId",
				siteId
			)
		}

		// add date range to params

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

		// send request to return data

		return httpClient<MaintenanceDashboardData>(
			`/api/portal/dashboard/maintenance-dashboard?${params.toString()}`
		);
	},

	// =====================================================
	// Maintenance dashboard support records
	// =====================================================

	getMaintenanceDashboardItems: async(
		query: DashboardMaintenanceItemsQuery
	): Promise<DashboardMaintenanceItemsResponse> => {
		const params = new URLSearchParams();

		// data check

		const customerNo =
			query.customerNo
				.trim()
				.toUpperCase();

		const siteId =
			query.siteId
				?.trim()
				.toUpperCase() ?? "";

		if (!customerNo && !siteId) {
			throw new Error(
				"Customer No or Site ID is required."
			);
		}

		// set parameters

		if (customerNo) {
			params.set(
				"customerNo",
				customerNo
			);
		}

		if (siteId) {
			params.set(
				"siteId",
				siteId
			);
		}

		params.set(
			"dataMonth",
			query.dataMonth
		);

		params.set(
			"dataYear",
			query.dataYear.toString()
		);

		params.set(
			"filterType",
			query.filterType
		);

		// pagination

		params.set(
			"page",
			Math.max(
				query.page ?? 1,
				1
			).toString()
		);

		params.set(
			"pageSize",
			Math.min(
				Math.max(
					query.pageSize ?? 30,
					1
				),
				30
			).toString()
		);

		// send response to return

		return httpClient<DashboardMaintenanceItemsResponse>(
			`/api/portal/dashboard/maintenance-dashboard/items?${params.toString()}`
		);
	}
};

export default dashboardApi;