import "../styles/app-styles/dashboard/Dashboard.css";

import { 
	useMemo,
	useEffect, 
	useState ,
} from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../data/auth/useAuth";

import {
	getStoredCustomerNo,
	setStoredCustomerNo,
} from "../data/storage/customerStorage";

import {
	getStoredPreferredDashboard,
} from "../data/storage/settingsStorage";

import {
	customerHasSla,
} from "../data/helpers/slaHelpers";

import type {
	CallsKpiSelection,
	DashboardMonth,
	DashboardSelect,
	SlaKpiSelection,
} from "../data/types/dashboardTypes";

import {
	hasUnrestrictedAccess,
	getUserCustomerNos,
	canAccessCustomer
} from "../data/auth/accessHelpers";

import DashboardHeader from "../components/dashboard/general/DashboardHeader";
import DashboardWelcome from "../components/dashboard/general/DashboardWelcome";
import DashboardSelector from "../components/dashboard/general/DashboardSelector";
import DashboardDataSection from "../components/dashboard/general/DashboardDataSection";

import CallsDashboardBoard from "../components/dashboard/boards/CallsDashboardBoard";
import CallsDashboardSupportTable from "../components/dashboard/boards/CallsDashboardSupportTable";
import MaintenanceDashboardBoard from "../components/dashboard/boards/MaintenanceDashboardBoard";
import SlaDashboardBoard from "../components/dashboard/boards/SlaDashboardBoard";
import SlaDashboardSupportTable from "../components/dashboard/boards/SlaDashboardSupportTable";

const Dashboard = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	// =====================================================
	// Access
	// =====================================================

	const unrestricted = 
		user 
			? hasUnrestrictedAccess(user)
			: false;

	const allowedCustomerNos = 
		useMemo(() => 
			user 
				? getUserCustomerNos(user)
				: [],
		[user]
	);

	// =====================================================
	// Customer / site
	// =====================================================

	const [customerNo, setCustomerNo] =
		useState(() => getStoredCustomerNo());

	const [searchedCustomerNo, setSearchedCustomerNo] =
		useState("");

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
		useState<DashboardSelect>(() => {
			const stored =
				getStoredPreferredDashboard();

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

	const [selectedSlaKpi, setSelectedSlaKpi] = 
		useState<SlaKpiSelection>(null);

	const [error, setError] =
		useState("");

	// =====================================================
	// Customer access restriction
	// =====================================================

	useEffect(() => {
		if (!user) {
			setError(
				"Unable to resolve user information. You will now be logged out."
			);

			void logout();
			navigate("/login", { replace: true });
			return;
		}

		if (unrestricted) {
			return;
		}

		if (allowedCustomerNos.length === 0) {
			setCustomerNo("");
			setSearchedCustomerNo("");
			setError(
				"No customer access has been assigned to this account."
			);
			return;
		}

		const storedCustomerNo =
			getStoredCustomerNo()
				.trim()
				.toUpperCase();

		const initialCustomerNo =
			canAccessCustomer(user, storedCustomerNo)
				? storedCustomerNo
				: allowedCustomerNos[0];

		setCustomerNo(initialCustomerNo);
		setSearchedCustomerNo(initialCustomerNo);
		setStoredCustomerNo(initialCustomerNo);
	}, [
		user,
		logout,
		navigate,
		unrestricted,
		allowedCustomerNos,
	]);

	// =====================================================
	// SLA access restriction
	// =====================================================

	const slaAvailable =
		customerHasSla(
			searchedCustomerNo
		);

	useEffect(() => {
		if (
			selectedDashboard === "sla" &&
			searchedCustomerNo &&
			!customerHasSla(
				searchedCustomerNo
			)
		) {
			setSelectedDashboard("calls");
			setSelectedSlaKpi(null);
		}
	}, [
		searchedCustomerNo,
		selectedDashboard,
	]);

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

	// =====================================================
	// Search
	// =====================================================

	const handleCustomerSearch = () => {
		setError("");

		const cleanCustomerNo =
			customerNo.trim().toUpperCase();

		const cleanSiteId =
			siteId.trim().toUpperCase();

		if (!user) {
			setError(
				"Unable to resolve user information."
			);
			return;
		}

		if (!cleanCustomerNo) {
			setError(
				"Customer No is required."
			);
			return;
		}

		if (
			!unrestricted &&
			!canAccessCustomer(
				user,
				cleanCustomerNo
			)
		) {
			setError(
				"You do not have access to this customer."
			);
			return;
		}

		if (
			specificSite &&
			!cleanSiteId
		) {
			setError(
				"Site ID is required when Specific Site is selected."
			);
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

		setSelectedCallsKpi(null);
	};

	// =====================================================
	// Dashboard renderer
	// =====================================================

	const renderDashboard = () => {
		switch (selectedDashboard) {
			case "calls":
				return (
					<CallsDashboardBoard
						customerNo={searchedCustomerNo}
						siteId={searchedSiteId}
						selectedMonth={selectedMonth}
						selectedYear={selectedYear}
						onMonthChange={(month) => {
							setSelectedMonth(month);
							setSelectedCallsKpi(null);
						}}
						onYearChange={(year) => {
							setSelectedYear(year);
							setSelectedCallsKpi(null);
						}}
						selectedKpi={selectedCallsKpi}
						onKpiChange={setSelectedCallsKpi}
					/>
				);

			case "system-maintenance":
				return (
					<MaintenanceDashboardBoard
						customerNo={searchedCustomerNo}
						siteId={searchedSiteId} 
						selectedMonth={"ALL"} 
						selectedYear={0} 
						onMonthChange={function (month: DashboardMonth): void {
							throw new Error("Function not implemented.");
						} } 
						onYearChange={function (year: number): void {
							throw new Error("Function not implemented.");
						} } 
						selectedKpi={null} 
						onKpiChange={function (value: MaintenanceKpiSelection): void {
							throw new Error("Function not implemented.");
						} }					
					/>
				);

			case "sla":
				return (
					<SlaDashboardBoard
						customerNo={searchedCustomerNo}
						siteId={searchedSiteId}
						selectedMonth={selectedMonth}
						selectedYear={selectedYear}
						onMonthChange={(month) => {
							setSelectedMonth(month);
							setSelectedSlaKpi(null);
						}}
						onYearChange={(year) => {
							setSelectedYear(year);
							setSelectedSlaKpi(null);
						}}
						selectedKpi={selectedSlaKpi}
						onKpiChange={setSelectedSlaKpi}
					/>
				);
		}
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="dashboard-screen">
			<DashboardHeader
				customerNo={customerNo}
				searchedCustomerNo={searchedCustomerNo}
				specificSite={specificSite}
				siteId={siteId}
				searchedSiteId={searchedSiteId}
				hasUnrestrictedAccess={unrestricted}
				allowedCustomerNos={allowedCustomerNos}
				onCustomerNoChange={setCustomerNo}
				onSpecificSiteChange={setSpecificSite}
				onSiteIdChange={setSiteId}
				onSearch={handleCustomerSearch}
			/>

			{error && (
				<p className="dashboard-error">
					{error}
				</p>
			)}

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
					slaAvailable={slaAvailable}
					onSelect={(dashboard) => {
						setSelectedDashboard(dashboard);
						setSelectedCallsKpi(null);
						setSelectedSlaKpi(null);
					}}
				/>
			</section>

			<DashboardDataSection
				title={getDashboardTitle(
					selectedDashboard
				)}
			>
				{selectedDashboard === "calls" && (
					<CallsDashboardSupportTable
						customerNo={searchedCustomerNo}
						siteId={searchedSiteId}
						dataMonth={selectedMonth}
						dataYear={selectedYear}
						selectedKpi={selectedCallsKpi}
					/>
				)}

				{selectedDashboard === "sla" && (
					<SlaDashboardSupportTable
						customerNo={searchedCustomerNo}
						siteId={searchedSiteId}
						dataMonth={selectedMonth}
						dataYear={selectedYear}
						selectedKpi={selectedSlaKpi}
					/>
				)}

				{selectedDashboard ===
					"system-maintenance" && (
					<div className="dashboard-data-placeholder">
						<p>
							Detailed supporting records for this
							dashboard will appear here.
						</p>
					</div>
				)}
			</DashboardDataSection>
		</div>
	);
};

export default Dashboard;