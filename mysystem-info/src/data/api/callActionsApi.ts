import type { CallAction } from "../types/callTypes";
import { httpClient } from "./httpClient";
import { getCallStatusLabel } from "../types/callMappings";

type CallActionsResponse = {
	items: CallAction[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

const mapStatusString = (
	action: CallAction
): CallAction => {
	return {
		...action,
		callStatus: getCallStatusLabel(
			action.callStatus ?? ""
		),
	};
};

export const callActionsApi = {
	getActions: async (
		callNumber = 0,
		actionNo = 0,
		engineer = "",
		page = 1,
		pageSize = 50
	): Promise<CallActionsResponse> => {
		const cleanEngineer =
			engineer.trim().toUpperCase();

		if (callNumber <= 0) {
			throw new Error(
				"A valid Call Number is required."
			);
		}

		const params = new URLSearchParams();

		params.set(
			"callNumber",
			callNumber.toString()
		);

		if (actionNo > 0) {
			params.set(
				"actionNo",
				actionNo.toString()
			);
		}

		if (cleanEngineer) {
			params.set("engineer", cleanEngineer);
		}

		params.set(
			"page",
			Math.max(page, 1).toString()
		);

		params.set(
			"pageSize",
			Math.min(
				Math.max(pageSize, 1),
				50
			).toString()
		);

		const response =
			await httpClient<CallActionsResponse>(
				`/api/portal/call-actions?${params.toString()}`
			);

		return {
			...response,
			items: response.items.map(mapStatusString),
		};
	},
};