import { httpClient } from "./httpClient";
import type {
	EngineerReference,
	PagedReferenceResponse,
	ReferenceQuery,
	SystemTypeReference,
} from "../types/referenceTypes";

const createReferenceParams = (
	query: ReferenceQuery = {}
): URLSearchParams => {
	const params = new URLSearchParams();

	const cleanCode = query.code?.trim().toUpperCase() ?? "";
	const cleanDescription = query.description?.trim() ?? "";

	if (cleanCode) {
		params.set("code", cleanCode);
	}

	if (cleanDescription) {
		params.set("description", cleanDescription);
	}

	params.set(
		"page",
		Math.max(query.page ?? 1, 1).toString()
	);

	params.set(
		"pageSize",
		Math.min(
			Math.max(query.pageSize ?? 100, 1),
			100
		).toString()
	);

	return params;
};

export const referenceApi = {
	getSystemTypes: async (
		query: ReferenceQuery = {}
	): Promise<PagedReferenceResponse<SystemTypeReference>> => {
		const params = createReferenceParams(query);

		return httpClient<
			PagedReferenceResponse<SystemTypeReference>
		>(
			`/api/portal/reference/system-types?${params.toString()}`
		);
	},

	getEngineers: async (
		query: ReferenceQuery = {}
	): Promise<PagedReferenceResponse<EngineerReference>> => {
		const params = createReferenceParams(query);

		return httpClient<
			PagedReferenceResponse<EngineerReference>
		>(
			`/api/portal/reference/engineers?${params.toString()}`
		);
	},
};

export default referenceApi;