export type Site = {
	siteId: string;
	customerNo: string;
	siteName: string;
	status: string;
	name: string;
	add1: string;
	add2: string;
	add3: string;
	add4: string;
	postCode: string;
	propertyReferenceNo: string;
};

export type SiteCall = {
	callId: string;
	callNo: string;
	status: "Open" | "Closed" | "Cancelled" | string;
	description?: string;
	loggedDate?: string;
	closedDate?: string;
};

export type SiteFilters = {
	siteId: string;
	propertyReferenceNo: string;
	postCode: string;
	status: string;
};