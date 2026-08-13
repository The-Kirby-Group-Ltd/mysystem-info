import {
	useEffect,
	useState,
} from "react";

import "../../../styles/app-styles/dashboard/DashboardSupportTable.css";

import CallsTable from "../../calls/CallsTable";
import CallDetailsModal from "../../calls/CallDetailsModal";

import dashboardApi from "../../../data/api/dashboardApi";

import type {
	Call,
} from "../../../data/types/callTypes";

import type {
	CallsKpiSelection,
	DashboardMonth,
} from "../../../data/types/dashboardTypes";

type CallsDashboardSupportTableProps = {
	customerNo: string;
	siteId?: string;

	dataMonth: DashboardMonth;
	dataYear: number;

	selectedKpi: CallsKpiSelection;
};

const CallsDashboardSupportTable = ({
	customerNo,
	siteId = "",

	dataMonth,
	dataYear,

	selectedKpi,
}: CallsDashboardSupportTableProps) => {
	const [calls, setCalls] =
		useState<Call[]>([]);

	const [selectedCall, setSelectedCall] =
		useState<Call | null>(null);

	const [page, setPage] =
		useState(1);

	const [hasMore, setHasMore] =
		useState(false);

	const [total, setTotal] =
		useState(0);

	const [isLoading, setIsLoading] =
		useState(false);

	const [error, setError] =
		useState("");

	// Reset to page one whenever the KPI changes.
	useEffect(() => {
		setPage(1);
	}, [
		selectedKpi,
		customerNo,
		siteId,
		dataMonth,
		dataYear,
	]);

	useEffect(() => {
		let isCancelled = false;

		const loadCalls = async () => {
			if (!selectedKpi) {
				setCalls([]);
				setTotal(0);
				setHasMore(false);

				return;
			}

			setIsLoading(true);
			setError("");

			try {
				const result =
					await dashboardApi
						.getCallsDashboardItems({
							customerNo,
							siteId,

							dataMonth,
							dataYear,

							filterType:
								selectedKpi,

							page,
							pageSize: 30,
						});

				if (!isCancelled) {
					setCalls(
						result.items
					);

					setTotal(
						result.total
					);

					setHasMore(
						result.hasMore
					);
				}
			} catch (error) {
				if (!isCancelled) {
					setCalls([]);

					setError(
						error instanceof Error
							? error.message
							: "Failed to load supporting calls."
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

		loadCalls();

		return () => {
			isCancelled = true;
		};
	}, [
		customerNo,
		siteId,
		dataMonth,
		dataYear,
		selectedKpi,
		page,
	]);

	if (!selectedKpi) {
		return (
			<div className="dashboard-data-placeholder">
				<p>
					Select a KPI above to view its
					supporting calls.
				</p>
			</div>
		);
	}

	const title =
		selectedKpi === "OPEN"
			? "Open Calls"
			: selectedKpi ===
				  "COMPLETED"
				? "Completed Calls"
				: "Further Action Calls";

	return (
		<div className="dashboard-support-table">
			<div className="dashboard-support-table-heading">
				<div>
					<strong>
						{title}
					</strong>

					<span>
						{total} record
						{total === 1
							? ""
							: "s"}
					</span>
				</div>
			</div>

			{error && (
				<div
					className="dashboard-error"
					role="alert"
				>
					<p>{error}</p>
				</div>
			)}

			<CallsTable
				calls={calls}
				rowsToShow={30}
				isLoading={isLoading}
				onCallClick={
					setSelectedCall
				}
			/>

			<div className="dashboard-support-pagination">
				<button
					type="button"
					disabled={
						page <= 1 ||
						isLoading
					}
					onClick={() =>
						setPage(
							(current) =>
								current -
								1
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
								current +
								1
						)
					}
				>
					›
				</button>
			</div>

			{selectedCall && (
				<CallDetailsModal
					call={
						selectedCall
					}
					onClose={() =>
						setSelectedCall(
							null
						)
					}
				/>
			)}
		</div>
	);
};

export default CallsDashboardSupportTable;