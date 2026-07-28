import { httpClient } from "./httpClient";
import type { SiteSystem, SystemMaintenanceSchedule } from "../types/systemsTypes";

type SiteSystemsResponse = {
    items: SiteSystem[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
};

type SystemMaintenanceScheduleResponse = { 
    items: SystemMaintenanceSchedule[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}

export const systemsApi = {
    getSystems: async (
        systemNo: number,
        siteId: string,
        systemCode: string,
        status: string,
        maintained_YN: string,
        page = 1,
        pageSize = 100,
        
    ): Promise<SiteSystemsResponse> => {
        const params = new URLSearchParams();

        systemNo = (!(systemNo > 0))
            ? 0
            : systemNo;
        const cleanSiteId = siteId.trim().toUpperCase();
        const cleanSystemCode = systemCode.trim().toUpperCase();
        const cleanStatus = status.trim().toUpperCase();
        const cleanMaintained = maintained_YN.trim().toUpperCase();

        if (!cleanSiteId) {
            throw new Error("Site ID could not be retrieved.");
        }

        params.set("siteId", cleanSiteId);

        if (systemNo > 0) { params.set("systemNo", systemNo.toString().trim()); }
        if (cleanSystemCode) { params.set("systemCode", cleanSystemCode); }
        if (cleanStatus) { params.set("status", cleanStatus); }
        if (cleanMaintained) {params.set("maintained_YN", cleanMaintained); }

        params.set("page", Math.max(page, 1).toString());
        params.set(
			"pageSize",
			Math.min(Math.max(pageSize, 1), 100).toString()
		);

        return httpClient<SiteSystemsResponse>(
            `/api/portal/site-systems?${params.toString()}`
        );
    },

    getSystemMaintenanceSchedule: async (
        system: SiteSystem,
    ): Promise<SystemMaintenanceScheduleResponse> => {
        const params = new URLSearchParams();

        const cleanSiteId = system.siteId.trim().toUpperCase();
        const systemNo = (!(system.systemNo > 0))
            ? ""
            : system.systemNo.toString().trim();

        if (!cleanSiteId || systemNo === "") {
            throw new Error("System information is not sufficient to retrieve maintenance info.");
        }

        params.set("siteId", cleanSiteId);
        params.set("systemNo", systemNo);

        return httpClient<SystemMaintenanceScheduleResponse>(
            `/api/portal/system-maint-schedules?${params.toString()}`
        );
    }
}