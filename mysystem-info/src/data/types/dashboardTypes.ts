import type { Call } from "./callTypes";

export type DashboardSelect =
	| "calls"
	| "system-maintenances"
	| "sla";

export type DashboardMonth =
	| "ALL"
	| "JAN"
	| "FEB"
	| "MAR"
	| "APR"
	| "MAY"
	| "JUN"
	| "JUL"
	| "AUG"
	| "SEP"
	| "OCT"
	| "NOV"
	| "DEC";

export type DashboardBreakdownItem = {
	code: string;
	label: string;
	count: number;
};

export type CallsDashboardData = {
	customerNo: string;
	siteId: string;

	openCalls: number;
	completedCalls: number;
	furtherActions: number;

	statusBreakdown: DashboardBreakdownItem[];
	callTypeBreakdown: DashboardBreakdownItem[];
	systemTypeBreakdown: DashboardBreakdownItem[];
};

export type CallsDashboardQuery = {
	customerNo: string;
	siteId?: string;
	dataMonth?: DashboardMonth;
	dataYear?: number;
};

export type DashboardCallsFilterType =
	| "OPEN"
	| "COMPLETED"
	| "FURTHER_ACTION"
	| "STATUS"
	| "CALL_TYPE"
	| "SYSTEM_TYPE";

export type CallsKpiSelection =
	| "OPEN"
	| "COMPLETED"
	| "FURTHER_ACTION"
	| null;

export type DashboardCallsItemsQuery = {
	customerNo: string;
	siteId?: string;

	dataMonth: DashboardMonth;
	dataYear: number;

	filterType: DashboardCallsFilterType;
	filterValue?: string;

	page?: number;
	pageSize?: number;
};

export type DashboardCallsItemsResponse = {
	items: Call[];

	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};