import "../styles/app-styles/calls/Calls.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../data/auth/useAuth";
import { callsApi } from "../data/api/callsApi";

import CallsFilterPanel from "../components/calls/CallsFilterPanel";
import CallsTable from "../components/calls/CallsTable";
import CallDetailsModal from "../components/calls/CallDetailsModal";

import {
	getStoredCustomerNo,
	setStoredCustomerNo,
} from "../data/storage/customerStorage";

import {
	getStoredPreferredPageSize,
} from "../data/storage/settingsStorage";

import type {
	Call,
	CallFilters,
} from "../data/types/callTypes";

// =========================================================
// Defaults
// =========================================================

const emptyFilters: CallFilters = {
	siteId: "",
	loggedFrom: "",
	loggedTo: "",
	systemType: "",
};

const Calls = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	// =====================================================
	// Access
	// =====================================================

	const hasUnrestrictedAccess =
		user?.roles.includes("Administrator") === true ||
		user?.roles.includes("Staff") === true ||
		user?.roles.includes("Engineer") === true;

	const allowedCustomerNos =
		user?.customerNos
			?.map((customerNo) =>
				customerNo.trim().toUpperCase()
			)
			.filter(Boolean) ?? [];

	// =====================================================
	// Customer state
	// =====================================================

	const [customerNo, setCustomerNo] = useState(
		() => getStoredCustomerNo()
	);

	const [searchedCustomerNo, setSearchedCustomerNo] =
		useState("");

	// =====================================================
	// Filter state
	// =====================================================

	const [filters, setFilters] =
		useState<CallFilters>(emptyFilters);

	// =====================================================
	// Call state
	// =====================================================

	const [calls, setCalls] = useState<Call[]>([]);

	const [selectedCall, setSelectedCall] =
		useState<Call | null>(null);

	// =====================================================
	// Pagination state
	// =====================================================

	const [page, setPage] = useState(1);
	const [pageInput, setPageInput] = useState("1");

	const [rowsToShow, setRowsToShow] = useState(() => {
		const stored = getStoredPreferredPageSize();

		switch (stored) {
			case 25:
				return 25;
			case 30:
				return 30;
			case 50:
				return 50;
			case 100:
				return 100;
			default:
				return 10;
		}
	});

	const [hasMore, setHasMore] = useState(false);

	// =====================================================
	// Request state
	// =====================================================

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

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

		if (hasUnrestrictedAccess) {
			return;
		}

		if (allowedCustomerNos.length === 0) {
			setCustomerNo("");
			setError(
				"No customer access has been assigned to this account."
			);
			return;
		}

		const storedCustomerNo =
			getStoredCustomerNo()
				.trim()
				.toUpperCase();

		const storedCustomerIsAllowed =
			allowedCustomerNos.includes(storedCustomerNo);

		setCustomerNo(
			storedCustomerIsAllowed
				? storedCustomerNo
				: allowedCustomerNos[0]
		);
	}, [
		user,
		logout,
		navigate,
		hasUnrestrictedAccess,
	]);

	// =====================================================
	// Load calls
	// =====================================================

	const loadCalls = async (pageToLoad = 1) => {
		setError("");

		const cleanCustomerNo =
			customerNo.trim().toUpperCase();

		if (!cleanCustomerNo) {
			setError("Customer No is required.");
			return;
		}

		if (
			!hasUnrestrictedAccess &&
			!allowedCustomerNos.includes(cleanCustomerNo)
		) {
			setError(
				"You do not have access to this customer."
			);
			return;
		}

		if (pageToLoad < 1) {
			setError(
				"Page number must be 1 or higher."
			);
			return;
		}

		try {
			setIsLoading(true);

			const result = await callsApi.getCalls(
				cleanCustomerNo,
				filters.siteId,
				0,
				filters.loggedFrom,
				filters.loggedTo,
				"",
				filters.systemType,
				pageToLoad,
				rowsToShow
			);

			setCalls(result.items);
			setPage(result.page);
			setPageInput(result.page.toString());
			setHasMore(result.hasMore);

			setCustomerNo(cleanCustomerNo);
			setSearchedCustomerNo(cleanCustomerNo);
			setStoredCustomerNo(cleanCustomerNo);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to load calls."
			);
		} finally {
			setIsLoading(false);
		}
	};

	// =====================================================
	// Pagination handlers
	// =====================================================

	const handlePageSubmit = () => {
		const requestedPage =
			Number(pageInput);

		if (
			!Number.isInteger(requestedPage) ||
			requestedPage < 1
		) {
			setError(
				"Please enter a valid page number."
			);
			return;
		}

		void loadCalls(requestedPage);
	};

	const handleRowsChange = (value: number) => {
		const cleanValue =
			Math.min(
				Math.max(value, 1),
				100
			);

		setRowsToShow(cleanValue);
	};

	// =====================================================
	// Customer selector
	// =====================================================

	const renderCustomerSelector = () => {
		if (hasUnrestrictedAccess) {
			return (
				<input
					type="text"
					placeholder="Customer No"
					value={customerNo}
					onChange={(event) =>
						setCustomerNo(
							event.target.value
						)
					}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							void loadCalls(1);
						}
					}}
				/>
			);
		}

		return (
			<select
				value={customerNo}
				disabled={
					allowedCustomerNos.length === 0
				}
				onChange={(event) =>
					setCustomerNo(
						event.target.value
					)
				}
			>
				{allowedCustomerNos.length === 0 ? (
					<option value="">
						No customers available
					</option>
				) : (
					allowedCustomerNos.map(
						(allowedCustomerNo) => (
							<option
								key={allowedCustomerNo}
								value={allowedCustomerNo}
							>
								{allowedCustomerNo}
							</option>
						)
					)
				)}
			</select>
		);
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="calls-screen">
			{/* =================================================
			    Header
			================================================= */}

			<div className="calls-header">
				<div>
					<p className="calls-eyebrow">
						Service Activity
					</p>

					<h1 className="calls-heading">
						Calls
					</h1>

					{searchedCustomerNo && (
						<p className="calls-subtitle">
							Showing customer{" "}
							<strong>
								{searchedCustomerNo}
							</strong>
						</p>
					)}
				</div>

				<div className="calls-customer-search">
					{renderCustomerSelector()}

					<button
						type="button"
						disabled={
							isLoading ||
							!customerNo
						}
						onClick={() =>
							void loadCalls(1)
						}
					>
						Search
					</button>
				</div>
			</div>

			{/* =================================================
			    Filters
			================================================= */}

			<section className="calls-controls-card">
				<div className="calls-controls-heading">
					<div>
						<p className="calls-section-eyebrow">
							Filters
						</p>

						<h2>Find calls</h2>
					</div>

					<div className="calls-toolbar">
						<label className="calls-toolbar-control">
							<span>Rows</span>

							<input
								type="number"
								min={1}
								max={100}
								value={rowsToShow}
								onChange={(event) =>
									handleRowsChange(
										Number(
											event.target.value
										)
									)
								}
							/>
						</label>
					</div>
				</div>

				<CallsFilterPanel
					filters={filters}
					onFiltersChange={setFilters}
				/>
			</section>

			{/* =================================================
			    Error
			================================================= */}

			{error && (
				<p className="calls-error">
					{error}
				</p>
			)}

			{/* =================================================
			    Calls table
			================================================= */}

			<div className="calls-view">
				<CallsTable
					calls={calls}
					rowsToShow={rowsToShow}
					isLoading={isLoading}
					onCallClick={setSelectedCall}
				/>
			</div>

			{/* =================================================
			    Pagination
			================================================= */}

			<div className="calls-pagination">
				<button
					type="button"
					className="calls-pagination-button"
					disabled={
						page <= 1 ||
						isLoading
					}
					onClick={() =>
						void loadCalls(page - 1)
					}
				>
					‹
				</button>

				<div className="calls-page-jump">
					<span>Page</span>

					<input
						type="number"
						min={1}
						value={pageInput}
						onChange={(event) =>
							setPageInput(
								event.target.value
							)
						}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								handlePageSubmit();
							}
						}}
					/>

					<button
						type="button"
						disabled={isLoading}
						onClick={
							handlePageSubmit
						}
					>
						Go
					</button>
				</div>

				<button
					type="button"
					className="calls-pagination-button"
					disabled={
						!hasMore ||
						isLoading
					}
					onClick={() =>
						void loadCalls(page + 1)
					}
				>
					›
				</button>
			</div>

			{/* =================================================
			    Call details
			================================================= */}

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

export default Calls;