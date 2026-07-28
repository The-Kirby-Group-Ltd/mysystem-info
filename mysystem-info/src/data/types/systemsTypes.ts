export type SiteSystem = {
    systemNo: number;
    siteId: string;
    systemCode: string;
    status: string;
    maintained_YN: string;
    commissionedDate: string;
    lastMaintenanceDate: string;
    nextMaintenanceDate: string;
}

export type SiteSystemsFilters = {
    systemNo: number;
    siteId: string;
    systemCode: string;
    status: string;
}


export type SystemMaintenanceSchedule = {
    siteId: string;
    systemNo: number;
    nextMaintenanceDate: string;
    description: string;
}