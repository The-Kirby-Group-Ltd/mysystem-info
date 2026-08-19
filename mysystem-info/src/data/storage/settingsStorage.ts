// keep portal preferences in local storage

import type { 
    DefaultDashboard,
    DefaultPageSize,
} from "../types/settingsTypes";

// ===========================================================
// Default dashboard preference
// ===========================================================

export const PREFERRED_DASHBOARD_STORAGE_KEY = "mysystem-preferred-dashboard";

export const getStoredPreferredDashboard = (): DefaultDashboard => {
    const stored = localStorage.getItem(PREFERRED_DASHBOARD_STORAGE_KEY) ?? null;

    var preferred: DefaultDashboard = null;

    switch (stored) {
        case "calls":
            preferred = "calls";
            break;
        case "system-maintenance":
            preferred = "system-maintenance";
            break;
        case "sla":
            preferred = "sla";
            break;
        default: 
            setStoredPreferredDashboard("calls");
            preferred = getStoredPreferredDashboard();
            break;
    }

    return preferred;
}

export const setStoredPreferredDashboard = (preferred: DefaultDashboard): void => {
    if (!preferred || preferred == null)  {
        setStoredPreferredDashboard("calls");
        return;
    }

    localStorage.setItem(
        PREFERRED_DASHBOARD_STORAGE_KEY,
        preferred.toString()
    );
}

// ===========================================================
// Default page size preference
// ===========================================================

export const PREFERRED_PAGE_SIZE_KEY = "mysystem-preferred-pagesize";

export const getStoredPreferredPageSize = (): DefaultPageSize => {
    const stored = localStorage.getItem(PREFERRED_PAGE_SIZE_KEY) ?? null;

    var preferred: DefaultPageSize = null;

    switch (stored) {
        case "10": 
            preferred = 10;
            break;
        case "25":
            preferred = 25;
            break;
        case "30":
            preferred = 30;
            break;
        case "50": 
            preferred = 50;
            break;
        case "100":
            preferred = 100;
            break;
        default: 
            setStoredPreferredPageSize(10);
            preferred = getStoredPreferredPageSize();
            break;
    }

    return preferred;
}

export const setStoredPreferredPageSize = (preferred: DefaultPageSize): void => {
    if (preferred == null) {
        setStoredPreferredPageSize(10);
        return;
    }

    localStorage.setItem(PREFERRED_PAGE_SIZE_KEY, preferred.toString());
    return;
}
