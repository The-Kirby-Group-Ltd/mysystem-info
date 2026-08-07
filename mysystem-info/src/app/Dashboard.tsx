import "../styles/app-styles/dashboard/Dashboard.css";

import { useState } from "react";

import {
	getStoredCustomerNo,
	setStoredCustomerNo,
} from "../data/storage/customerStorage";

import type { DashboardSelect } from "../data/types/dashboardTypes";

import DashboardHeader from "../components/dashboard/general/DashboardHeader";
import DashboardWelcome from "../components/dashboard/general/DashboardWelcome";
import DashboardSelector from "../components/dashboard/general/DashboardSelector";
import DashboardDataSection from "../components/dashboard/general/DashboardDataSection";

import CallsDashboardBoard from "../components/dashboard/boards/CallsDashboardBoard";
import MaintenanceDashboardBoard from "../components/dashboard/boards/MaintenanceDashboardBoard";
import SlaDashboardBoard from "../components/dashboard/boards/SlaDashboardBoard";

const Dashboard = () => {
	const [customerNo, setCustomerNo] = useState(
		() => getStoredCustomerNo()
	);

	const [searchedCustomerNo, setSearchedCustomerNo] =
		useState(() => getStoredCustomerNo());

    const [specificSite, setSpecificSite] = useState(false);
    const [siteId, setSiteId] = useState("");
    const [searchedSiteId, setSearchedSiteId] = useState("");

	const [selectedDashboard, setSelectedDashboard] =
		useState<DashboardSelect>("calls");

	const getDashboardTitle = (
		dashboard: DashboardSelect
	): string => {
		switch (dashboard) {
			case "calls":
				return "Calls Dashboard";

			case "system-maintenances":
				return "System Maintenance Dashboard";

			case "sla":
				return "SLA Call Dashboard";
		}
	};

	const handleCustomerSearch = () => {
        const cleanCustomerNo =
            customerNo.trim().toUpperCase();

        const cleanSiteId =
            siteId.trim().toUpperCase();

        if (!cleanCustomerNo) {
            return;
        }

        setCustomerNo(cleanCustomerNo);
        setSearchedCustomerNo(cleanCustomerNo);
        setStoredCustomerNo(cleanCustomerNo);

        if (specificSite) {
            setSiteId(cleanSiteId);
            setSearchedSiteId(cleanSiteId);
        } else {
            setSiteId("");
            setSearchedSiteId("");
        }
    };

	const renderDashboard = () => {
		switch (selectedDashboard) {
			case "calls":
				return (
					<CallsDashboardBoard
						customerNo={searchedCustomerNo}
                        siteId={searchedSiteId}
					/>
				);

			case "system-maintenances":
				return (
					<MaintenanceDashboardBoard
						customerNo={searchedCustomerNo}
                        siteId={searchedSiteId}
					/>
				);

			case "sla":
				return (
					<SlaDashboardBoard
						customerNo={searchedCustomerNo}
                        siteId={searchedSiteId}
					/>
				);
		}
	};

	return (
		<div className="dashboard-screen">
			<DashboardHeader
                customerNo={customerNo}
                searchedCustomerNo={searchedCustomerNo}
                onCustomerNoChange={setCustomerNo}

                specificSite={specificSite}
                siteId={siteId}
                searchedSiteId={searchedSiteId}
                onSpecificSiteChange={setSpecificSite}
                onSiteIdChange={setSiteId}

                onSearch={handleCustomerSearch}
            />

			<DashboardWelcome />

			<section className="dashboard-section">
				<div className="dashboard-chart-area">
					<div className="dashboard-board-header">
						<div>
							<p className="dashboard-board-eyebrow">
								Overview
							</p>

							<h3 className="dashboard-board-subheading">
								{getDashboardTitle(
									selectedDashboard
								)}
							</h3>
						</div>

						{searchedCustomerNo && (
							<span className="dashboard-customer-badge">
								{searchedCustomerNo}
							</span>
						)}
					</div>

					<div className="dashboard-board-content">
						{renderDashboard()}
					</div>
				</div>

				<DashboardSelector
					selectedDashboard={selectedDashboard}
					onSelect={setSelectedDashboard}
				/>
			</section>

			<DashboardDataSection
				title={getDashboardTitle(
					selectedDashboard
				)}
			/>
		</div>
	);
};

export default Dashboard;