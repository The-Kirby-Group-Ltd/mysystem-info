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