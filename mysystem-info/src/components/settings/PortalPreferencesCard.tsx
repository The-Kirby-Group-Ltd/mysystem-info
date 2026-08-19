import { useState, useEffect } from "react";

import { 
    getStoredPreferredDashboard,
    setStoredPreferredDashboard,
    getStoredPreferredPageSize,
    setStoredPreferredPageSize,
} from "../../data/storage/settingsStorage";

import type {
    DefaultDashboard,
    DefaultPageSize,
} from "../../data/types/settingsTypes";

import selectArrow from "../../assets/select-arrow.svg";

const PortalPreferencesCard = () => {
    // ===========================================================
    // State
    // ===========================================================

    const [preferredDashboardEntry, setPreferredDashboardEntry] = 
        useState<DefaultDashboard>(
            getStoredPreferredDashboard()
        );
    
    const [preferredPageSizeEntry, setPreferredPageSizeEntry] = 
        useState<DefaultPageSize>(
            getStoredPreferredPageSize()
        );

    // ===========================================================
    // Preference update helpers
    // ===========================================================

    // Preferred dashboard

    useEffect(() => {
        // check against current 
        var existing = getStoredPreferredDashboard();

        if (existing == preferredDashboardEntry) 
            return;

        try {
            setStoredPreferredDashboard(preferredDashboardEntry as DefaultDashboard)
        } catch {
            setStoredPreferredDashboard("calls");
        }

        return;
    }, [preferredDashboardEntry]);

    // Preferred page size

    useEffect(() => {
        var existing = getStoredPreferredPageSize();

        if (existing == preferredPageSizeEntry)
            return;

        try {
            setStoredPreferredPageSize(preferredPageSizeEntry as DefaultPageSize);
        } catch {
            setStoredPreferredPageSize(10);
        }
        
        return;
    }, [preferredPageSizeEntry]);

    // ===========================================================
    // Render
    // ===========================================================

    return (
        <div className="portal-preferences">
            <div className="settings-card-heading">
                <h2>
                    Portal Preferences
                </h2>
            </div>

            <div className="settings-card-content">
                <form className="portal-preferences-grid">
                    <div className="preferred-dashboard">
                        <p className="setting-field-header">
                            <span>Preferred Dashboard</span>
                        </p>

                        <div className="selection-field">
                            <select
                                name="preferred-dashboard"
                                className="settings-input-field"
                                value={preferredDashboardEntry?.toString()}
                                onChange={(event) => {
                                    setPreferredDashboardEntry(
                                        event.target.value as DefaultDashboard
                                    );
                                }}
                            >
                                <option value="calls">Calls Dashboard</option>
                                <option value="system-maintenance">
                                    Maintenance Dashboard
                                </option>
                                <option value="sla">SLA Dashboard</option>
                            </select>

                            <img
                                className="settings-select-icon"
                                src={selectArrow}
                                alt=""
                                aria-hidden="true"
                            />
                        </div>
                       
                    </div>

                    <div className="preferred-page-size">
                        <p className="setting-field-header">
                            <span>Preferred Page Size (Tables)</span>
                        </p>
                        
                        <div className="selection-field">
                            <select
                                name="preferred page size"
                                className="settings-input-field"
                                value={preferredPageSizeEntry?.toString()}
                                onChange={(event) => {
                                    setPreferredPageSizeEntry(
                                        parseInt(event.target.value) as DefaultPageSize
                                    );
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>

                            <img
                                className="settings-select-icon"
                                src={selectArrow}
                                alt=""
                                aria-hidden="true"
                            />
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default PortalPreferencesCard;