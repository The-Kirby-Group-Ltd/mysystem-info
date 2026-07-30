export type Call = {
	callNumber: number;
	callType: string;
	callStatus: string;
	siteId: string;
	loggedDate: string;
	loggingOperator: string;
	engineer: string;
	systemType: string;
	completedDate: string;
	customerReference: string;
	invoiceNo: string;
	loggedRemarks: string;
	previousMaintenanceDate: string | null;
	nextMaintenanceDate: string | null;
};

export type CallFilters = {
	siteId: string;
	loggedFrom: string;
	loggedTo: string;
	systemType: string;
};