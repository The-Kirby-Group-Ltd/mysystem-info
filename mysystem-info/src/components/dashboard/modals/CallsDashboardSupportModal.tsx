import {
	useEffect,
	useState,
} from "react";

import "../../../styles/app-styles/dashboard/DashboardModal.css";

import CallsTable from "../../calls/CallsTable";
import CallDetailsModal from "../../calls/CallDetailsModal";

import dashboardApi from "../../../data/api/dashboardApi";

import type {
	Call,
} from "../../../data/types/callTypes";

import type {
	DashboardCallsFilterType,
	DashboardMonth,
} from "../../../data/types/dashboardTypes";

type CallsDashboardSupportModalProps = {
	title: string;

	customerNo: string;
	siteId?: string;

	dataMonth: DashboardMonth;
	dataYear: number;

	filterType: DashboardCallsFilterType;
	filterValue: string;

	onClose: () => void;
};

const CallsDashboardSupportModal = ({
	title,

	customerNo,
	siteId = "",

	dataMonth,
	dataYear,

	filterType,
	filterValue,

	onClose,
}: CallsDashboardSupportModalProps) => {
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

	// =====================================================
	// Load support calls
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadCalls = async () => {
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

							filterType,
							filterValue,

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
		filterType,
		filterValue,
		page,
	]);

	// =====================================================
	// Escape key
	// =====================================================

	useEffect(() => {
		const handleKeyDown = (
			event: KeyboardEvent
		) => {
			if (
				event.key === "Escape" &&
				!selectedCall
			) {
				onClose();
			}
		};

		window.addEventListener(
			"keydown",
			handleKeyDown
		);

		return () => {
			window.removeEventListener(
				"keydown",
				handleKeyDown
			);
		};
	}, [
		onClose,
		selectedCall,
	]);

	return (
		<div
			className="dashboard-support-modal-backdrop"
			role="presentation"
			onMouseDown={(event) => {
				if (
					event.target ===
					event.currentTarget
				) {
					onClose();
				}
			}}
		>
			<section
				className="dashboard-support-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="dashboard-support-modal-title"
				onMouseDown={(event) =>
					event.stopPropagation()
				}
			>
				<header className="dashboard-support-modal-header">
					<div>
						<p className="dashboard-board-eyebrow">
							Supporting Calls
						</p>

						<h2 id="dashboard-support-modal-title">
							{title}
						</h2>

						<p>
							{total} call
							{total === 1
								? ""
								: "s"}
						</p>
					</div>

					<button
						type="button"
						className="dashboard-support-modal-close"
						onClick={
							onClose
						}
						aria-label="Close supporting calls"
					>
						×
					</button>
				</header>

				<div className="dashboard-support-modal-content">
					{error && (
						<div
							className="dashboard-error"
							role="alert"
						>
							<p>
								{error}
							</p>
						</div>
					)}

					<div className="supporting-calls-table">
						<CallsTable
							calls={calls}
							rowsToShow={30}
							isLoading={
								isLoading
							}
							onCallClick={
								setSelectedCall
							}
						/>
					</div>
					

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
				</div>
			</section>

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
					isNested
				/>
			)}
		</div>
	);
};

export default CallsDashboardSupportModal;