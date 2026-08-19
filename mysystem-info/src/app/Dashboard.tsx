import "../styles/app-styles/dashboard/Dashboard.css";

import { useState } from "react";

import {
	getStoredCustomerNo,
	setStoredCustomerNo,
} from "../data/storage/customerStorage";

import type {
	CallsKpiSelection,
	DashboardMonth,
	DashboardSelect,
} from "../data/types/dashboardTypes";

import DashboardHeader from "../components/dashboard/general/DashboardHeader";
import DashboardWelcome from "../components/dashboard/general/DashboardWelcome";
import DashboardSelector from "../components/dashboard/general/DashboardSelector";
import DashboardDataSection from "../components/dashboard/general/DashboardDataSection";

import CallsDashboardBoard from "../components/dashboard/boards/CallsDashboardBoard";
import CallsDashboardSupportTable from "../components/dashboard/boards/CallsDashboardSupportTable";
import MaintenanceDashboardBoard from "../components/dashboard/boards/MaintenanceDashboardBoard";
import SlaDashboardBoard from "../components/dashboard/boards/SlaDashboardBoard";
import { getStoredPreferredDashboard } from "../data/storage/settingsStorage";

const Dashboard = () => {
	// =====================================================
	// Customer / site
	// =====================================================

	const [customerNo, setCustomerNo] =
		useState(() =>
			getStoredCustomerNo()
		);

	const [searchedCustomerNo, setSearchedCustomerNo] = 
		useState(() =>
			getStoredCustomerNo()
		);

	const [specificSite, setSpecificSite] = 
		useState(false);

	const [siteId, setSiteId] =
		useState("");

	const [searchedSiteId, setSearchedSiteId] = 
		useState("");

	// =====================================================
	// Dashboard
	// =====================================================

	const [selectedDashboard, setSelectedDashboard] =
		useState<DashboardSelect>((): DashboardSelect => {
			var stored = getStoredPreferredDashboard();
			
			switch (stored) {
				case "calls":
					return "calls";
				case "system-maintenance":
					return "system-maintenance";
				case "sla":
					return "sla";
				default: 
					return "calls";
			}
		});

	const [selectedMonth, setSelectedMonth] =
		useState<DashboardMonth>("ALL");

	const [selectedYear, setSelectedYear] =
		useState(new Date().getFullYear());

	const [selectedCallsKpi, setSelectedCallsKpi] =
		useState<CallsKpiSelection>(null);

	// =====================================================
	// Helpers
	// =====================================================

	const getDashboardTitle = (
		dashboard: DashboardSelect
	): string => {
		switch (dashboard) {
			case "calls":
				return "Calls Dashboard";

			case "system-maintenance":
				return "System Maintenance Dashboard";

			case "sla":
				return "SLA Call Dashboard";
		}
	};

	const handleCustomerSearch =
		() => {
			const cleanCustomerNo =
				customerNo
					.trim()
					.toUpperCase();

			const cleanSiteId =
				siteId
					.trim()
					.toUpperCase();

			if (!cleanCustomerNo) {
				return;
			}

			if (
				specificSite &&
				!cleanSiteId
			) {
				return;
			}

			setCustomerNo(
				cleanCustomerNo
			);

			setSearchedCustomerNo(
				cleanCustomerNo
			);

			setStoredCustomerNo(
				cleanCustomerNo
			);

			if (specificSite) {
				setSiteId(
					cleanSiteId
				);

				setSearchedSiteId(
					cleanSiteId
				);
			} else {
				setSiteId("");
				setSearchedSiteId("");
			}

			setSelectedCallsKpi(
				null
			);
		};

	const renderDashboard =
		() => {
			switch (
				selectedDashboard
			) {
				case "calls":
					return (
						<CallsDashboardBoard
							customerNo={
								searchedCustomerNo
							}
							siteId={
								searchedSiteId
							}
							selectedMonth={
								selectedMonth
							}
							selectedYear={
								selectedYear
							}
							onMonthChange={(
								month
							) => {
								setSelectedMonth(
									month
								);

								setSelectedCallsKpi(
									null
								);
							}}
							onYearChange={(
								year
							) => {
								setSelectedYear(
									year
								);

								setSelectedCallsKpi(
									null
								);
							}}
							selectedKpi={
								selectedCallsKpi
							}
							onKpiChange={
								setSelectedCallsKpi
							}
						/>
					);

				case "system-maintenance":
					return (
						<MaintenanceDashboardBoard
							customerNo={
								searchedCustomerNo
							}
							siteId={
								searchedSiteId
							}
						/>
					);

				case "sla":
					return (
						<SlaDashboardBoard
							customerNo={
								searchedCustomerNo
							}
							siteId={
								searchedSiteId
							}
						/>
					);
			}
		};

	return (
		<div className="dashboard-screen">
			<DashboardHeader
				customerNo={
					customerNo
				}
				searchedCustomerNo={
					searchedCustomerNo
				}
				onCustomerNoChange={
					setCustomerNo
				}
				specificSite={
					specificSite
				}
				siteId={siteId}
				searchedSiteId={
					searchedSiteId
				}
				onSpecificSiteChange={
					setSpecificSite
				}
				onSiteIdChange={
					setSiteId
				}
				onSearch={
					handleCustomerSearch
				}
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
								{
									searchedCustomerNo
								}
							</span>
						)}
					</div>

					<div className="dashboard-board-content">
						{renderDashboard()}
					</div>
				</div>

				<DashboardSelector
					selectedDashboard={
						selectedDashboard
					}
					onSelect={(
						dashboard
					) => {
						setSelectedDashboard(
							dashboard
						);

						setSelectedCallsKpi(
							null
						);
					}}
				/>
			</section>

			<DashboardDataSection
				title={
					getDashboardTitle(
						selectedDashboard
					)
				}
			>
				{selectedDashboard ===
				"calls" ? (
					<CallsDashboardSupportTable
						customerNo={
							searchedCustomerNo
						}
						siteId={
							searchedSiteId
						}
						dataMonth={
							selectedMonth
						}
						dataYear={
							selectedYear
						}
						selectedKpi={
							selectedCallsKpi
						}
					/>
				) : (
					<div className="dashboard-data-placeholder">
						<p>
							Detailed supporting
							records for this
							dashboard will appear
							here.
						</p>
					</div>
				)}
			</DashboardDataSection>
		</div>
	);
};

export default Dashboard;