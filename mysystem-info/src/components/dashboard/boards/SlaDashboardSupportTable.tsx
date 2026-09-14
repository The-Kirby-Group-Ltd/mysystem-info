import "../../../styles/app-styles/dashboard/SlaDashboard.css";

import {
	useEffect,
	useState,
} from "react";

import { dashboardApi } from "../../../data/api/dashboardApi";

import CallsTable from "../../calls/CallsTable";
import CallDetailsModal from "../../calls/CallDetailsModal";

import type {
	Call,
} from "../../../data/types/callTypes";

import type {
	DashboardMonth,
	SlaKpiSelection,
} from "../../../data/types/dashboardTypes";

type SlaDashboardSupportTableProps = {
	customerNo: string;
	siteId?: string;

	dataMonth: DashboardMonth;
	dataYear: number;

	selectedKpi: SlaKpiSelection;
};

const SlaDashboardSupportTable = ({
	customerNo,
	siteId = "",
	dataMonth,
	dataYear,
	selectedKpi,
}: SlaDashboardSupportTableProps) => {
	// =====================================================
	// State
	// =====================================================

	const [calls, setCalls] =
		useState<Call[]>([]);

	const [selectedCall, setSelectedCall] =
		useState<Call | null>(null);

	const [page, setPage] =
		useState(1);

	const [total, setTotal] =
		useState(0);

	const [hasMore, setHasMore] =
		useState(false);

	const [isLoading, setIsLoading] =
		useState(false);

	const [error, setError] =
		useState("");

	const pageSize = 30;

	// =====================================================
	// Load supporting calls
	// =====================================================

	useEffect(() => {
		setPage(1);
	}, [
		customerNo,
		siteId,
		dataMonth,
		dataYear,
		selectedKpi,
	]);

	useEffect(() => {
		const loadCalls = async () => {
			setError("");

			if (
				!customerNo ||
				!selectedKpi
			) {
				setCalls([]);
				setTotal(0);
				setHasMore(false);
				return;
			}

			try {
				setIsLoading(true);

				const result =
					await dashboardApi
						.getSlaDashboardItems({
							customerNo,
							siteId,
							dataMonth,
							dataYear,
							filterType:
								selectedKpi,
							page,
							pageSize,
						});

				setCalls(result.items);
				setTotal(result.total);
				setHasMore(result.hasMore);
			} catch (error) {
				setCalls([]);
				setTotal(0);
				setHasMore(false);

				setError(
					error instanceof Error
						? error.message
						: "Failed to load supporting SLA calls."
				);
			} finally {
				setIsLoading(false);
			}
		};

		void loadCalls();
	}, [
		customerNo,
		siteId,
		dataMonth,
		dataYear,
		selectedKpi,
		page,
	]);

	// =====================================================
	// No selection
	// =====================================================

	if (!selectedKpi) {
		return (
			<div className="sla-support-placeholder">
				Select either Within SLA or Breached SLA
				to view the supporting calls.
			</div>
		);
	}

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="sla-support-table">
			<div className="sla-support-heading">
				<div>
					<p className="sla-dashboard-eyebrow">
						Supporting Records
					</p>

					<h4>
						{selectedKpi === "FAILED"
							? "Calls Breaching SLA"
							: "Calls Within SLA"}
					</h4>
				</div>

				<span className="sla-total-badge">
					{total} records
				</span>
			</div>

			{error && (
				<p className="sla-dashboard-error">
					{error}
				</p>
			)}

			<div className="sla-support-table-wrapper">
				<CallsTable
					calls={calls}
					rowsToShow={pageSize}
					isLoading={isLoading}
					onCallClick={setSelectedCall}
				/>
			</div>

			<div className="sla-support-pagination">
				<button
					type="button"
					disabled={
						page <= 1 ||
						isLoading
					}
					onClick={() =>
						setPage(
							(current) =>
								Math.max(
									current - 1,
									1
								)
						)
					}
				>
					‹
				</button>

				<span>
					Page {page}
				</span>

				<button
					type="button"
					disabled={
						!hasMore ||
						isLoading
					}
					onClick={() =>
						setPage(
							(current) =>
								current + 1
						)
					}
				>
					›
				</button>
			</div>

			{selectedCall && (
				<CallDetailsModal
					call={selectedCall}
					onClose={() =>
						setSelectedCall(null)
					}
				/>
			)}
		</div>
	);
};

export default SlaDashboardSupportTable;