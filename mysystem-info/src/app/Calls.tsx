import "../styles/app-styles/calls/Calls.css";

import { useState } from "react";
import CallsFilterPanel from "../components/calls/CallsFilterPanel";
import CallsTable from "../components/calls/CallsTable";
import CallDetailsModal from "../components/calls/CallDetailsModal";

import {
	getStoredCustomerNo,
	setStoredCustomerNo,
} from "../data/storage/customerStorage";

import type {
	Call,
	CallFilters,
} from "../data/types/callTypes";
import { callsApi } from "../data/api/callsApi";
import { getStoredPreferredPageSize } from "../data/storage/settingsStorage";

const emptyFilters: CallFilters = {
	siteId: "",
	loggedFrom: "",
	loggedTo: "",
	systemType: "",
};

const Calls = () => {
	const [customerNo, setCustomerNo] = useState(
		() => getStoredCustomerNo()
	);
	const [searchedCustomerNo, setSearchedCustomerNo] = useState("");

	const [filters, setFilters] =
		useState<CallFilters>(emptyFilters);

	const [calls, setCalls] = useState<Call[]>([]);
	const [selectedCall, setSelectedCall] =
		useState<Call | null>(null);

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

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const loadCalls = async (pageToLoad = 1) => {
		setError("");

		const cleanCustomerNo = customerNo.trim().toUpperCase();

		if (!cleanCustomerNo) {
			setError("Customer No is required.");
			return;
		}

		if (pageToLoad < 1) {
			setError("Page number must be 1 or higher.");
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
			setStoredCustomerNo(cleanCustomerNo);
			setCustomerNo(cleanCustomerNo);
			setSearchedCustomerNo(cleanCustomerNo);
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

	const handlePageSubmit = () => {
		const requestedPage = Number(pageInput);

		if (!Number.isInteger(requestedPage) || requestedPage < 1) {
			setError("Please enter a valid page number.");
			return;
		}

		loadCalls(requestedPage);
	};

	const handleRowsChange = (value: number) => {
		const cleanValue = Math.min(Math.max(value, 1), 100);
		setRowsToShow(cleanValue);
	};

	return (
		<div className="calls-screen">
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
								{searchedCustomerNo.toUpperCase()}
							</strong>
						</p>
					)}
				</div>

				<div className="calls-customer-search">
					<input
						type="text"
						placeholder="Customer No"
						value={customerNo}
						onChange={(event) =>
							setCustomerNo(event.target.value)
						}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								loadCalls(1);
							}
						}}
					/>

					<button
						type="button"
						onClick={() => loadCalls(1)}
					>
						Search
					</button>
				</div>
			</div>

			<section className="calls-controls-card">
				<div className="calls-controls-heading">
					<div>
						<p className="calls-section-eyebrow">
							Filters
						</p>

						<h2>
							Find calls
						</h2>
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
										Number(event.target.value)
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

			{error && (
				<p className="calls-error">{error}</p>
			)}

			<div className="calls-view">
				<CallsTable
					calls={calls}
					rowsToShow={rowsToShow}
					isLoading={isLoading}
					onCallClick={setSelectedCall}
				/>
			</div>

			<div className="calls-pagination">
				<button
					type="button"
					className="calls-pagination-button"
					disabled={page <= 1 || isLoading}
					onClick={() => loadCalls(page - 1)}
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
							setPageInput(event.target.value)
						}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								handlePageSubmit();
							}
						}}
					/>

					<button
						type="button"
						onClick={handlePageSubmit}
						disabled={isLoading}
					>
						Go
					</button>
				</div>

				<button
					type="button"
					className="calls-pagination-button"
					disabled={!hasMore || isLoading}
					onClick={() => loadCalls(page + 1)}
				>
					›
				</button>
			</div>

			{selectedCall && (
				<CallDetailsModal
					call={selectedCall}
					onClose={() => setSelectedCall(null)}
				/>
			)}
		</div>
	);
};

export default Calls;