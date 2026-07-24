import { httpClient } from "./httpClient";
import type { Site } from "../types/siteTypes";

type SitesResponse = {
	items: Site[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

export const sitesApi = {
	getSites: async (
		customerNo: string,
		page = 1,
		pageSize = 10,
		status = "",
		siteId = "",
		postCode = ""
	): Promise<SitesResponse> => {
		const params = new URLSearchParams();

		const cleanCustomerNo = customerNo.trim().toUpperCase();
		const cleanSiteId = siteId.trim().toUpperCase();
		const cleanPostCode = postCode.trim().toUpperCase();
		const cleanStatus = status.trim().toUpperCase();

		if (!cleanCustomerNo && !cleanSiteId) {
			throw new Error("Either Customer No or Site ID is required.");
		}

		if (cleanCustomerNo) { params.set("customerNo", cleanCustomerNo); }
		if (cleanSiteId) { params.set("siteId", cleanSiteId); }
		if (cleanPostCode) { params.set("postCode", cleanPostCode); }
		if (cleanStatus) { params.set("status", cleanStatus); }

		params.set("page", Math.max(page, 1).toString());
		params.set(
			"pageSize",
			Math.min(Math.max(pageSize, 1), 100).toString()
		);

		return httpClient<SitesResponse>(
			`/api/portal/sites?${params.toString()}`
		);
	},

	getSiteById: async (siteId: string): Promise<Site> => {
		const cleanSiteId = siteId.trim().toUpperCase();

		if (!cleanSiteId) {
			throw new Error("Site ID is required.");
		}

		const response = await httpClient<SitesResponse>(
			`/api/portal/sites?siteId=${encodeURIComponent(cleanSiteId)}`
		);

		const site = response.items[0];

		if (!site) {
			throw new Error(`Site ${cleanSiteId} was not found.`);
		}

		return site;
	},
};

export default sitesApi;