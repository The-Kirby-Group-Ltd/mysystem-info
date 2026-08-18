import type { Call } from "./callTypes";

// ==============================================
// General Use Dashboard Types
// ==============================================

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

// ==============================================
// Calls Dashboard Types
// ==============================================

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

// ==============================================
// Maintenance Dashboard Types
// ==============================================

export type MaintenanceDashboardData = {
	customerNo: string;
	siteId: string;

	upToDate: number;
	dueSoon: number;
	overdue: number;

	maintenanceStatusBreakdown: DashboardBreakdownItem[];
	dueSoonBreakdown: DashboardBreakdownItem[];
}

export type MaintenanceDashboardQuery = {
	customerNo: string;
	siteId?: string;
	dataMonth?: DashboardMonth;
	dataYear?: number;
}

export type MaintenanceKpiSelection = 
	| "UP_TO_DATE"
	| "DUE_SOON"
	| "OVERDUE"
	| null

export type DashboardMaintenanceFilterType = 
	| "UP_TO_DATE"
	| "DUE_SOON"
	| "OVERDUE"
	| "WITHIN_7_DAYS"
	| "DAYS_8_TO_14"
	| "DAYS_15_TO_30"
	| "DAYS_31_TO_90"

export type MaintenanceDashboardItem = {
	siteId: string;
	systemNo: number;
	nextMaintenanceDate: string;
	description: string;
	statusCode: string;
	statusLabel: string;
}

export type DashboardMaintenanceItemsQuery = {
	customerNo: string;
	siteId?: string;

	dataMonth: DashboardMonth;
	dataYear: number;

	filterType: DashboardMaintenanceFilterType;

	page?: number;
	pageSize?: number;
}

export type DashboardMaintenanceItemsResponse = {
	items: MaintenanceDashboardItem[]

	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
}