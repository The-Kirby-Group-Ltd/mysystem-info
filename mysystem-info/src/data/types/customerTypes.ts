export type Customer = {
    customerNo: string;
    customerName: string;
}

export type CustomersRequest = {
    customerNo: string | null;
    customerName: string | null;
}

export type CustomerRequestBySiteId = {
    siteId: string;
}
