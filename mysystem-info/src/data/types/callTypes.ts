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

export type CallAction = {
	callNumber: number;
	callActionNumber: number;
	remarks: string; // information on call from office (before visit)	

	appointmentDate: string; // planned engineer arrival
	appointmentFromTime: string; 
	startedDate: string;
	startedTime: string;
	finishedDate: string;
	finishedTime: string;
	hoursOnSite: number;
	minutesOnSite: number;

	engineer: string; // engineer ref code
	actionTaken: string; // engineer remarks
	signatureName: string; // customer representative signatory
	onCallEngineersName: string; // engineer signatory

	propertyReferenceNo: string;
	name: string;
	callStatus: string;
	customerReference: string;
	siteName: string;
}

export type CallActionFilters = {
	callNumber: number;
	callActionNo: number;
	engineer: string;
}