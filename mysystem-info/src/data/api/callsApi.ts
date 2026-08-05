import type { Call } from "../types/callTypes";
import { httpClient } from "./httpClient";
import {
    getCallStatusLabel,
    getCallTypeLabel 
} from "../types/callMappings";

type CallsResponse = {
	items: Call[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

// map call type and call status strings
const mapTypeStrings = (call: Call): Call => {
    return {
        ...call,
		callStatus: getCallStatusLabel(call.callStatus ?? ""),
		callType: getCallTypeLabel(call.callType ?? ""),
    }
}

export const callsApi = {
	getCalls: async (
        customerNo: string,
		siteId = "",
		callNumber = 0,
		loggedFrom = "",
		loggedTo = "",
		engineer = "",
		systemType = "",
		page = 1,
		pageSize = 10
    ): Promise<CallsResponse> => {
        // set clean parameter strings
        const cleanCustomerNo = customerNo.trim().toUpperCase();
        const cleanSiteId = siteId.trim().toUpperCase();
        const cleanEngineer = engineer.trim().toUpperCase();
        const cleanSystemType = systemType.trim().toUpperCase();

        if (!cleanCustomerNo && !cleanSiteId && callNumber <= 0) {
            throw new Error(
                "Customer No, Site ID, or Call Number is required."
            );
        }

        // add query parameters 
        const params = new URLSearchParams();
        
        if (cleanCustomerNo) { params.set("customerNo", cleanCustomerNo); }
        if (cleanSiteId) { params.set("siteId", cleanSiteId); }
        if (callNumber > 0) { params.set("callNumber", callNumber.toString()); }
        if (loggedFrom.trim()) { params.set("loggedFrom", loggedFrom.trim()); }
        if (loggedTo.trim()) { params.set("loggedTo", loggedTo.trim()); }
        if (cleanEngineer) { params.set("engineer", cleanEngineer); }
        if (cleanSystemType) {params.set("systemType", cleanSystemType); }

        // pagination
        params.set("page", Math.max(page, 1).toString());
        params.set("pageSize", Math.min(Math.max(pageSize, 1), 100).toString());

        const response = await httpClient<CallsResponse>(
            `/api/portal/calls?${params.toString()}`
        );

        return {
            ...response,
            items: response.items.map(mapTypeStrings),
        };
    },

    getCallByNumber: async (
		callNumber: number
	): Promise<Call> => {
		if (callNumber <= 0) {
			throw new Error("Call Number is required.");
		}

		const response = await httpClient<CallsResponse>(
			`/api/portal/calls?callNumber=${callNumber}`
		);

		const call = response.items[0];

		if (!call) {
			throw new Error(`Call ${callNumber} was not found.`);
		}

		return mapTypeStrings(call);
	},
};