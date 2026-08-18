import {
	useEffect,
	useState,
} from "react";

import "../../../styles/app-styles/dashboard/DashboardBoards.css";

import dashboardApi from "../../../data/api/dashboardApi";

import DashboardDonutChart from "../general/DashboardDonutChart";
import CallsDashboardSupportModal from "../modals/CallsDashboardSupportModal";

import type {
	CallsDashboardData,
	CallsKpiSelection,
	DashboardBreakdownItem,
	DashboardCallsFilterType,
	DashboardMonth,
} from "../../../data/types/dashboardTypes";

type CallsDashboardBoardProps = {
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

	selectedKpi: CallsKpiSelection;

	onKpiChange: (
		value: CallsKpiSelection
	) => void;
};

type ChartModalState = {
	title: string;

	filterType: DashboardCallsFilterType;
	filterValue: string;
} | null;

const CallsDashboardBoard = ({
	customerNo,
	siteId = "",

	selectedMonth,
	selectedYear,

	onMonthChange,
	onYearChange,

	selectedKpi,
	onKpiChange,
}: CallsDashboardBoardProps) => {
	const [dashboardData, setDashboardData] =
		useState<CallsDashboardData | null>(
			null
		);

	const [isLoading, setIsLoading] =
		useState(false);

	const [error, setError] =
		useState("");

	const [chartModal, setChartModal] =
		useState<ChartModalState>(
			null
		);

	// =====================================================
	// Load summary dashboard
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadDashboardData =
			async () => {
				const cleanCustomerNo =
					customerNo
						.trim()
						.toUpperCase();

				const cleanSiteId =
					siteId
						.trim()
						.toUpperCase();

				if (
					!cleanCustomerNo &&
					!cleanSiteId
				) {
					setDashboardData(
						null
					);

					return;
				}

				setIsLoading(true);
				setError("");

				try {
					const result =
						await dashboardApi
							.getCallsDashboardData({
								customerNo:
									cleanCustomerNo,

								siteId:
									cleanSiteId,

								dataMonth:
									selectedMonth,

								dataYear:
									selectedYear,
							});

					if (!isCancelled) {
						setDashboardData(
							result
						);
					}
				} catch (error) {
					if (!isCancelled) {
						setDashboardData(
							null
						);

						setError(
							error instanceof Error
								? error.message
								: "Failed to load calls dashboard."
						);
					}
				} finally {
					if (!isCancelled) {
						setIsLoading(
							false
						);
					}
				}
			};

		loadDashboardData();

		return () => {
			isCancelled = true;
		};
	}, [
		customerNo,
		siteId,
		selectedMonth,
		selectedYear,
	]);

	// =====================================================
	// KPI selection
	// =====================================================

	const toggleKpi = (
		value: Exclude<
			CallsKpiSelection,
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
		filterType: DashboardCallsFilterType,
		item: DashboardBreakdownItem
	) => {
		setChartModal({
			title:
				`${title}: ${item.label}`,

			filterType,

			filterValue:
				item.code,
		});
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="calls-dashboard-board">
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
					<span>Year</span>

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
					/>
				</label>
			</div>

			{/* =============================
			    State
			============================= */}

			{isLoading && (
				<p className="dashboard-loading">
					Loading calls dashboard...
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
				<label
					className={
						selectedKpi ===
						"OPEN"
							? "dashboard-kpi-card dashboard-kpi-card-selectable dashboard-kpi-card-selected"
							: "dashboard-kpi-card dashboard-kpi-card-selectable"
					}
				>
					<input
						type="checkbox"
						className="dashboard-kpi-checkbox"
						checked={
							selectedKpi ===
							"OPEN"
						}
						onChange={() =>
							toggleKpi(
								"OPEN"
							)
						}
					/>

					<span>
						Open Calls
					</span>

					<strong>
						{isLoading
							? "—"
							: dashboardData
									?.openCalls ??
								0}
					</strong>

					<p>
						Calls currently awaiting
						completion.
					</p>
				</label>

				<label
					className={
						selectedKpi ===
						"COMPLETED"
							? "dashboard-kpi-card dashboard-kpi-card-selectable dashboard-kpi-card-selected"
							: "dashboard-kpi-card dashboard-kpi-card-selectable"
					}
				>
					<input
						type="checkbox"
						className="dashboard-kpi-checkbox"
						checked={
							selectedKpi ===
							"COMPLETED"
						}
						onChange={() =>
							toggleKpi(
								"COMPLETED"
							)
						}
					/>

					<span>
						Completed Calls
					</span>

					<strong>
						{isLoading
							? "—"
							: dashboardData
									?.completedCalls ??
								0}
					</strong>

					<p>
						Completed calls for the
						selected period.
					</p>
				</label>

				<label
					className={
						selectedKpi ===
						"FURTHER_ACTION"
							? "dashboard-kpi-card dashboard-kpi-card-selectable dashboard-kpi-card-selected"
							: "dashboard-kpi-card dashboard-kpi-card-selectable"
					}
				>
					<input
						type="checkbox"
						className="dashboard-kpi-checkbox"
						checked={
							selectedKpi ===
							"FURTHER_ACTION"
						}
						onChange={() =>
							toggleKpi(
								"FURTHER_ACTION"
							)
						}
					/>

					<span>
						Further Action
					</span>

					<strong>
						{isLoading
							? "—"
							: dashboardData
									?.furtherActions ??
								0}
					</strong>

					<p>
						Calls requiring
						additional work.
					</p>
				</label>
			</div>

			{/* =============================
			    Donut charts
			============================= */}

			<div className="dashboard-charts-grid">
				<DashboardDonutChart
					title="Call Status"
					data={
						dashboardData
							?.statusBreakdown ??
						[]
					}
					onItemClick={(item) =>
						openChartSupport(
							"Call Status",
							"STATUS",
							item
						)
					}
				/>

				<DashboardDonutChart
					title="Call Types"
					data={
						dashboardData
							?.callTypeBreakdown ??
						[]
					}
					onItemClick={(item) =>
						openChartSupport(
							"Call Type",
							"CALL_TYPE",
							item
						)
					}
				/>

				<DashboardDonutChart
					title="System Types"
					data={
						dashboardData
							?.systemTypeBreakdown ??
						[]
					}
					onItemClick={(item) =>
						openChartSupport(
							"System Type",
							"SYSTEM_TYPE",
							item
						)
					}
				/>
			</div>

			{chartModal && (
				<CallsDashboardSupportModal
					title={
						chartModal.title
					}
					customerNo={
						customerNo
					}
					siteId={siteId}
					dataMonth={
						selectedMonth
					}
					dataYear={
						selectedYear
					}
					filterType={
						chartModal.filterType
					}
					filterValue={
						chartModal.filterValue
					}
					onClose={() =>
						setChartModal(
							null
						)
					}
				/>
			)}
		</div>
	);
};

export default CallsDashboardBoard;