import { useEffect, useState } from "react";

import dashboardApi from "../../../data/api/dashboardApi";

import type {
	CallsDashboardData,
	DashboardMonth,
} from "../../../data/types/dashboardTypes";

type CallsDashboardBoardProps = {
	customerNo: string;
	siteId?: string;
};

const CallsDashboardBoard = ({
	customerNo,
	siteId = "",
}: CallsDashboardBoardProps) => {
	const [dashboardData, setDashboardData] =
		useState<CallsDashboardData | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const [selectedMonth, setSelectedMonth] =
		useState<DashboardMonth>("ALL");

	const [selectedYear, setSelectedYear] =
		useState(new Date().getFullYear());

	// =====================================================
	// Load calls dashboard data
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadDashboardData = async () => {
			const cleanCustomerNo =
				customerNo.trim().toUpperCase();

			const cleanSiteId =
				siteId.trim().toUpperCase();

			if (!cleanCustomerNo && !cleanSiteId) {
				setDashboardData(null);
				return;
			}

			setIsLoading(true);
			setError("");

			try {
				const result =
					await dashboardApi.getCallsDashboardData({
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
							: "Failed to load calls dashboard data."
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
		};
	}, [
		customerNo,
		siteId,
		selectedMonth,
		selectedYear,
	]);

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="calls-dashboard-board">
			<div className="dashboard-board-controls">
				<label>
					<span>Month</span>

					<select
						value={selectedMonth}
						onChange={(event) =>
							setSelectedMonth(
								event.target
									.value as DashboardMonth
							)
						}
					>
						<option value="ALL">
							All year
						</option>
						<option value="JAN">January</option>
						<option value="FEB">February</option>
						<option value="MAR">March</option>
						<option value="APR">April</option>
						<option value="MAY">May</option>
						<option value="JUN">June</option>
						<option value="JUL">July</option>
						<option value="AUG">August</option>
						<option value="SEP">September</option>
						<option value="OCT">October</option>
						<option value="NOV">November</option>
						<option value="DEC">December</option>
					</select>
				</label>

				<label>
					<span>Year</span>

					<input
						type="number"
						min={2000}
						max={new Date().getFullYear() + 1}
						value={selectedYear}
						onChange={(event) =>
							setSelectedYear(
								Number(event.target.value)
							)
						}
					/>
				</label>
			</div>

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

			<div className="dashboard-kpi-grid">
				<div className="dashboard-kpi-card">
					<span>Open Calls</span>

					<strong>
						{isLoading
							? "—"
							: dashboardData?.openCalls ?? 0}
					</strong>

					<p>
						Calls currently awaiting
						completion.
					</p>
				</div>

				<div className="dashboard-kpi-card">
					<span>Completed Calls</span>

					<strong>
						{isLoading
							? "—"
							: dashboardData?.completedCalls ?? 0}
					</strong>

					<p>
						Completed calls for the selected
						period.
					</p>
				</div>

				<div className="dashboard-kpi-card">
					<span>Further Action</span>

					<strong>
						{isLoading
							? "—"
							: dashboardData?.furtherActions ?? 0}
					</strong>

					<p>
						Calls requiring additional work.
					</p>
				</div>
			</div>

			<div className="dashboard-chart-placeholder">
				<div>
					<h4>Call Activity</h4>

					<p>
						Charts will be added here once the
						summary data is confirmed.
					</p>
				</div>
			</div>
		</div>
	);
};

export default CallsDashboardBoard;