import { httpClient } from "./httpClient";
import {
	type FailedToRespondReason,
	type EngineerReference,
	type PagedReferenceResponse,
	type ReferenceQuery,
	type SystemTypeReference,
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

	getFailedToRespondReason: (
		code: string
	) => {
		const cleanCode =
			code
				.trim()
				.toUpperCase();

		if (!cleanCode) {
			throw new Error(
				"Failed-to-respond reason code is required."
			);
		}

		return httpClient<FailedToRespondReason>(
			`/api/portal/reference/failed-to-respond-reasons/${encodeURIComponent(cleanCode)}`
		);
	},
};

export default referenceApi;