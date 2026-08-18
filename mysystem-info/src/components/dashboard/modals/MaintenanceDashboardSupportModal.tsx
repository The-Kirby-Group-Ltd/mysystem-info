import {
	useEffect,
	useState,
} from "react";

import "../../../styles/app-styles/dashboard/DashboardModal.css";

import dashboardApi from "../../../data/api/dashboardApi";

import type {
	DashboardMaintenanceFilterType,
	DashboardMonth,
	MaintenanceDashboardItem,
} from "../../../data/types/dashboardTypes";

type MaintenanceDashboardSupportModalProps = {
	title: string;

	customerNo: string;
	siteId?: string;

	dataMonth: DashboardMonth;
	dataYear: number;

	filterType: DashboardMaintenanceFilterType;

	onClose: () => void;
};

const MaintenanceDashboardSupportModal = ({
	title,

	customerNo,
	siteId = "",

	dataMonth,
	dataYear,

	filterType,

	onClose,
}: MaintenanceDashboardSupportModalProps) => {
	// =====================================================
	// State
	// =====================================================

	const [items, setItems] =
		useState<MaintenanceDashboardItem[]>([]);

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
	// Load supporting maintenance records
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadMaintenanceItems = async () => {
			setIsLoading(true);
			setError("");

			try {
				const result =
					await dashboardApi
						.getMaintenanceDashboardItems({
							customerNo,
							siteId,

							dataMonth,
							dataYear,

							filterType,

							page,
							pageSize: 30,
						});

				if (!isCancelled) {
					setItems(
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
					setItems([]);
					setTotal(0);
					setHasMore(false);

					setError(
						error instanceof Error
							? error.message
							: "Failed to load supporting maintenance records."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoading(false);
				}
			}
		};

		loadMaintenanceItems();

		return () => {
			isCancelled = true;
		};
	}, [
		customerNo,
		siteId,
		dataMonth,
		dataYear,
		filterType,
		page,
	]);

	// =====================================================
	// Reset page when filter/scope changes
	// =====================================================

	useEffect(() => {
		setPage(1);
	}, [
		customerNo,
		siteId,
		dataMonth,
		dataYear,
		filterType,
	]);

	// =====================================================
	// Escape key
	// =====================================================

	useEffect(() => {
		const handleKeyDown = (
			event: KeyboardEvent
		) => {
			if (event.key === "Escape") {
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
	}, [onClose]);

	// =====================================================
	// Date formatting
	// =====================================================

	const formatDate = (
		value: string
	) => {
		if (!value) {
			return "-";
		}

		const date =
			new Date(value);

		if (
			Number.isNaN(
				date.getTime()
			)
		) {
			return value;
		}

		return date.toLocaleDateString(
			"en-GB"
		);
	};

	// =====================================================
	// Render
	// =====================================================

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
				aria-labelledby="maintenance-dashboard-support-modal-title"
				onMouseDown={(event) =>
					event.stopPropagation()
				}
			>
				{/* =============================
				    Header
				============================= */}

				<header className="dashboard-support-modal-header">
					<div>
						<p className="dashboard-board-eyebrow">
							Supporting Maintenance
						</p>

						<h2 id="maintenance-dashboard-support-modal-title">
							{title}
						</h2>

						<p>
							{total} maintenance record
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
						aria-label="Close supporting maintenance records"
					>
						×
					</button>
				</header>

				{/* =============================
				    Content
				============================= */}

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

					<div className="supporting-maintenance-table">
						<table className="maintenance-support-table">
							<thead>
								<tr>
									<th>
										Site ID
									</th>

									<th>
										System
									</th>

									<th>
										Next Maintenance
									</th>

									<th>
										Description
									</th>

									<th>
										Status
									</th>
								</tr>
							</thead>

							<tbody>
								{isLoading ? (
									<tr>
										<td
											colSpan={5}
											className="maintenance-support-message"
										>
											Loading maintenance records...
										</td>
									</tr>
								) : items.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="maintenance-support-message"
										>
											No maintenance records found.
										</td>
									</tr>
								) : (
									items.map(
										(item) => (
											<tr
												key={`${item.siteId}-${item.systemNo}`}
											>
												<td>
													{item.siteId}
												</td>

												<td>
													{item.systemNo}
												</td>

												<td>
													{formatDate(
														item.nextMaintenanceDate
													)}
												</td>

												<td>
													{item.description ||
														"-"}
												</td>

												<td>
													<span
														className={[
															"maintenance-status-badge",
															`maintenance-status-${item.statusCode
																.toLowerCase()
																.replaceAll(
																	"_",
																	"-"
																)}`,
														].join(
															" "
														)}
													>
														{item.statusLabel}
													</span>
												</td>
											</tr>
										)
									)
								)}
							</tbody>
						</table>
					</div>

					{/* =============================
					    Pagination
					============================= */}

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
										Math.max(
											current - 1,
											1
										)
								)
							}
							aria-label="Previous page"
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
							aria-label="Next page"
						>
							›
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default MaintenanceDashboardSupportModal;