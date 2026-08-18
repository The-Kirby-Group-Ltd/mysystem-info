import {
	useEffect,
	useState,
} from "react";

import "../../../styles/app-styles/dashboard/DashboardBoards.css";

import dashboardApi from "../../../data/api/dashboardApi";

import DashboardDonutChart from "../general/DashboardDonutChart";
import MaintenanceDashboardSuppportModal from "../modals/MaintenanceDashboardSupportModal";

import type {
	MaintenanceDashboardData,
	MaintenanceKpiSelection,
	DashboardMaintenanceFilterType,
	DashboardBreakdownItem,
	DashboardMonth,
} from "../../../data/types/dashboardTypes";

type MaintenanceDashboardBoardProps = {
	customerNo: string;
	siteId?: string;
	
	selectedMonth: DashboardMonth;
	selectedYear: number;

	onMonthChange: (
		month: DashboardMonth
	) => void;

	onYearChange: (
		year: number
	) => void;

	selectedKpi: MaintenanceKpiSelection;

	onKpiChange: (
		value: MaintenanceKpiSelection
	) => void;
};

type ChartModalState = {
	title: string;
	filterType: DashboardMaintenanceFilterType;
} | null;

const MaintenanceDashboardBoard = ({
	customerNo,
	siteId = "",

	selectedMonth,
	selectedYear,

	onMonthChange,
	onYearChange,

	selectedKpi,
	onKpiChange,
}: MaintenanceDashboardBoardProps) => {

	// =====================================================
	// Initialise state
	// =====================================================

	const [dashboardData, setDashboardData] = 
		useState<MaintenanceDashboardData | null>(
			null
		);
	
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [chartModal, setChartModal] = 
		useState<ChartModalState>(
			null
		);
	
	// =====================================================
	// Load summary dashboard
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadDashboardData = async () => {
			const cleanCustomerNo = customerNo.trim().toUpperCase();
			const cleanSiteId = siteId.trim().toUpperCase();

			if (!cleanCustomerNo && !cleanSiteId) {
				setDashboardData(null);

				return;
			}

			setIsLoading(true);
			setError("");

			try {
				const result = await dashboardApi.getMaintenanceDashboardData({
					customerNo: cleanCustomerNo,
					siteId: cleanSiteId,
					dataMonth: selectedMonth,
					dataYear: selectedYear,
				});

				if (!isCancelled) {
					setDashboardData(result);
				}
			} catch (error) {
				if (!isCancelled) {
					setDashboardData(null);

					setError(
						error instanceof Error
							? error.message
							: "Failed to load maintenance dashboard."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoading(false);
				}
			}
		};

		loadDashboardData();

		return () => {
			isCancelled = true;
		}
	}, [customerNo, siteId, selectedMonth, selectedYear]);

	// =====================================================
	// KPI selection
	// =====================================================

	const toggleKpi = (
		value: Exclude<
			MaintenanceKpiSelection,
			null
		>
	) => {
		onKpiChange(
			selectedKpi === value
				? null
				: value
		);
	};

	// =====================================================
	// Donut selections
	// =====================================================

	const openChartSupport = (
		title: string,
		item: DashboardBreakdownItem
	) => {
		setChartModal({
			title: `${title}: ${item.label}`,
			filterType:
				item.code as DashboardMaintenanceFilterType,
		});
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="maintenance-dashboard-board">
			{/* =============================
			    Date controls
			============================= */}

			<div className="dashboard-board-controls">
				<label>
					<span>Month</span>

					<select
						value={
							selectedMonth
						}
						onChange={(
							event
						) =>
							onMonthChange(
								event.target
									.value as DashboardMonth
							)
						}
					>
						<option value="ALL">
							All year
						</option>
						<option value="JAN">
							January
						</option>
						<option value="FEB">
							February
						</option>
						<option value="MAR">
							March
						</option>
						<option value="APR">
							April
						</option>
						<option value="MAY">
							May
						</option>
						<option value="JUN">
							June
						</option>
						<option value="JUL">
							July
						</option>
						<option value="AUG">
							August
						</option>
						<option value="SEP">
							September
						</option>
						<option value="OCT">
							October
						</option>
						<option value="NOV">
							November
						</option>
						<option value="DEC">
							December
						</option>
					</select>
				</label>

				<label>
					<input
						type="number"
						min={2000}
						max={
							new Date()
								.getFullYear() +
							1
						}
						value={
							selectedYear
						}
						onChange={(
							event
						) =>
							onYearChange(
								Number(
									event.target
										.value
								)
							)
						}
						placeholder="Year"
					/>
				</label>
			</div>

			{/* =============================
			    State
			============================= */}

			{isLoading && (
				<p className="dashboard-loading">
					Loading Maintenance Dashboard...
				</p>
			)}

			{error && (
				<div 
					className="dashboard-error"
					role="alert"
				>
					<p>{error}</p>
				</div>
			)}

			{/* =============================
			    KPI cards
			============================= */}

			<div className="dashboard-kpi-grid">
				{/* up to date card */}
				<label
					className={
						selectedKpi ===
						"UP_TO_DATE"
							? "dashboard-kpi-card dashboard-kpi-card-selectable dashboard-kpi-card-selected"
							: "dashboard-kpi-card dashboard-kpi-card-selectable"
					}
				>
					<input 
						type="checkbox"
						className="dashboard-kpi-checkbox"
						checked={
							selectedKpi === "UP_TO_DATE"
						}	
						onChange={() => toggleKpi("UP_TO_DATE")}
					/>

					<span>Up-To-Date Systems</span>

					<strong>
						{isLoading	
							? "—"
							: dashboardData?.upToDate ?? 0
						}
					</strong>

					<p>
						Systems which are entirely up to 
						date on their maintenance plan.
					</p>
				</label>

				{/* due soon card */}
				<label
					className={
						selectedKpi ===
						"DUE_SOON"
							? "dashboard-kpi-card dashboard-kpi-card-selectable dashboard-kpi-card-selected"
							: "dashboard-kpi-card dashboard-kpi-card-selectable"
					}
				>
					<input 
						type="checkbox"
						className="dashboard-kpi-checkbox"
						checked={
							selectedKpi === "DUE_SOON"
						}	
						onChange={() => toggleKpi("DUE_SOON")}
					/>

					<span>Maintenance Due Soon</span>

					<strong>
						{isLoading	
							? "—"
							: dashboardData?.dueSoon ?? 0
						}
					</strong>

					<p>
						Systems which have a maintenance due 
						within the next 90 days.
					</p>
				</label>

				{/* overdue card */}
				<label
					className={
						selectedKpi ===
						"OVERDUE"
							? "dashboard-kpi-card dashboard-kpi-card-selectable dashboard-kpi-card-selected"
							: "dashboard-kpi-card dashboard-kpi-card-selectable"
					}
				>
					<input 
						type="checkbox"
						className="dashboard-kpi-checkbox"
						checked={
							selectedKpi === "OVERDUE"
						}	
						onChange={() => toggleKpi("OVERDUE")}
					/>

					<span>Maintenance Overdue</span>

					<strong>
						{isLoading	
							? "—"
							: dashboardData?.overdue ?? 0
						}
					</strong>

					<p>
						Systems which have an overdue
						maintenance date. 
					</p>
				</label>
			</div>

			{/* =============================
			    Donut charts
			============================= */}

			<div className="dashboard-charts-grid">
				<DashboardDonutChart 
					title="Maintenance Status"
					data={
						dashboardData?.maintenanceStatusBreakdown ?? []
					}
					onItemClick={(item) => 
						openChartSupport(
							"Maintenance Status",
							item
						)
					}
				/>

				<DashboardDonutChart 
					title="Due Soon Breakdown"
					data={
						dashboardData?.dueSoonBreakdown ?? []
					}
					onItemClick={(item) => 
						openChartSupport(
							"Due Soon Breakdown",
							item
						)
					}
				/>
			</div>

			{chartModal && (
				<MaintenanceDashboardSuppportModal
					title={chartModal.title}
					customerNo={customerNo}
					siteId={siteId}
					dataMonth={selectedMonth}
					dataYear={selectedYear}
					filterType={chartModal.filterType}

					onClose={() =>
						setChartModal(null)
					}
				/>
			)}
		</div>
	);
}

export default MaintenanceDashboardBoard;