export type DashboardSelect =
	| "calls"
	| "system-maintenances"
	| "sla";export type DashboardMonth =
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

export type CallsDashboardData = {
	customerNo: string;
	siteId: string;
	openCalls: number;
	completedCalls: number;
	furtherActions: number;
};

export type CallsDashboardQuery = {
	customerNo: string;
	siteId?: string;
	dataMonth?: DashboardMonth;
	dataYear?: number;
};