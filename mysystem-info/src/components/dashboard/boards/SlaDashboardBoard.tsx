import {
	useEffect,
	useState,
} from "react";

import "../../../styles/app-styles/dashboard/DashboardBoards.css";

import dashboardApi from "../../../data/api/dashboardApi";
import { customerHasSla } from "../../../data/helpers/slaHelpers";

import DashboardDonutChart from "../general/DashboardDonutChart";

import type {
	DashboardBreakdownItem,
	DashboardMonth,
	SlaDashboardData,
	SlaKpiSelection,
} from "../../../data/types/dashboardTypes";

type SlaDashboardBoardProps = {
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

	selectedKpi: SlaKpiSelection;

	onKpiChange: (
		value: SlaKpiSelection
	) => void;
};

const SlaDashboardBoard = ({
	customerNo,
	siteId = "",

	selectedMonth,
	selectedYear,

	onMonthChange,
	onYearChange,

	selectedKpi,
	onKpiChange,
}: SlaDashboardBoardProps) => {
	// =====================================================
	// State
	// =====================================================

	const [dashboardData, setDashboardData] =
		useState<SlaDashboardData | null>(
			null
		);

	const [isLoading, setIsLoading] =
		useState(false);

	const [error, setError] =
		useState("");

	// =====================================================
	// Derived state
	// =====================================================

	const slaAvailable =
		customerHasSla(customerNo);

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
					!cleanCustomerNo ||
					!slaAvailable
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
							.getSlaDashboardData({
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
								: "Failed to load SLA dashboard."
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

		void loadDashboardData();

		return () => {
			isCancelled = true;
		};
	}, [
		customerNo,
		siteId,
		selectedMonth,
		selectedYear,
		slaAvailable,
	]);

	// =====================================================
	// KPI selection
	// =====================================================

	const toggleKpi = (
		value: Exclude<
			SlaKpiSelection,
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
	// Donut selection
	// =====================================================

	const handleDonutSelection = (
		item: DashboardBreakdownItem
	) => {
		if (
			item.code === "SUCCESSFUL"
		) {
			toggleKpi(
				"SUCCESSFUL"
			);

			return;
		}

		if (
			item.code === "FAILED"
		) {
			toggleKpi(
				"FAILED"
			);
		}
	};

	// =====================================================
	// No SLA
	// =====================================================

	if (
		customerNo &&
		!slaAvailable
	) {
		return (
			<div className="dashboard-empty-state">
				<p>
					SLA reporting is not available
					for this customer.
				</p>
			</div>
		);
	}

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="sla-dashboard-board">
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
					Loading SLA dashboard...
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

			<div className="dashboard-kpi-grid dashboard-kpi-grid-two">
				<label
					className={
						selectedKpi ===
							"SUCCESSFUL"
							? "dashboard-kpi-card dashboard-kpi-card-selectable dashboard-kpi-card-selected"
							: "dashboard-kpi-card dashboard-kpi-card-selectable"
					}
				>
					<input
						type="checkbox"
						className="dashboard-kpi-checkbox"
						checked={
							selectedKpi ===
							"SUCCESSFUL"
						}
						onChange={() =>
							toggleKpi(
								"SUCCESSFUL"
							)
						}
					/>

					<span>
						Within SLA
					</span>

					<strong>
						{isLoading
							? "—"
							: dashboardData
									?.successfulCalls ??
								0}
					</strong>

					<p>
						Completed calls responded
						to within the required SLA.
					</p>

					{!isLoading &&
						dashboardData && (
							<small className="dashboard-kpi-secondary">
								{
									dashboardData
										.successPercentage
								}
								% compliance
							</small>
						)}
				</label>

				<label
					className={
						selectedKpi ===
							"FAILED"
							? "dashboard-kpi-card dashboard-kpi-card-selectable dashboard-kpi-card-selected"
							: "dashboard-kpi-card dashboard-kpi-card-selectable"
					}
				>
					<input
						type="checkbox"
						className="dashboard-kpi-checkbox"
						checked={
							selectedKpi ===
							"FAILED"
						}
						onChange={() =>
							toggleKpi(
								"FAILED"
							)
						}
					/>

					<span>
						Breached SLA
					</span>

					<strong>
						{isLoading
							? "—"
							: dashboardData
									?.failedCalls ??
								0}
					</strong>

					<p>
						Completed calls recorded
						as having breached SLA.
					</p>

					{!isLoading &&
						dashboardData && (
							<small className="dashboard-kpi-secondary">
								{
									dashboardData
										.failurePercentage
								}
								% of completed calls
							</small>
						)}
				</label>
			</div>

			{/* =============================
			    SLA donut
			============================= */}

			<div className="dashboard-charts-grid dashboard-charts-grid-single">
				<DashboardDonutChart
					title="SLA Compliance"
					data={
						dashboardData
							?.slaBreakdown ??
						[]
					}
					onItemClick={
						handleDonutSelection
					}
				/>
			</div>
		</div>
	);
};

export default SlaDashboardBoard;