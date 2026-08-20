import "../styles/app-styles/sites/Sites.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../data/auth/useAuth";
import { sitesApi } from "../data/api/sitesApi";

import SitesFilterPanel from "../components/sites/SitesFilterPanel";
import SitesTable from "../components/sites/SitesTable";
import SiteDetailsModal from "../components/sites/SiteDetailsModal";

import {
	getStoredCustomerNo,
	setStoredCustomerNo,
} from "../data/storage/customerStorage";

import {
	getStoredPreferredPageSize,
} from "../data/storage/settingsStorage";

import type {
	Site,
	SiteFilters,
} from "../data/types/siteTypes";

// =========================================================
// Defaults
// =========================================================

const emptyFilters: SiteFilters = {
	siteId: "",
	propertyReferenceNo: "",
	postCode: "",
	status: "",
};

const Sites = () => {
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
		useState<SiteFilters>(emptyFilters);

	// =====================================================
	// Site state
	// =====================================================

	const [sites, setSites] = useState<Site[]>([]);
	const [selectedSite, setSelectedSite] =
		useState<Site | null>(null);

	// =====================================================
	// Pagination state
	// =====================================================

	const [page, setPage] = useState(1);
	const [pageInput, setPageInput] = useState("1");

	const [siteRows, setSiteRows] = useState(() => {
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
	// Load sites
	// =====================================================

	const loadSites = async (pageToLoad = 1) => {
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

			const result = await sitesApi.getSites(
				cleanCustomerNo,
				pageToLoad,
				siteRows,
				filters.status,
				filters.siteId,
				filters.postCode
			);

			setSites(result.items);
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
					: "Failed to load sites."
			);
		} finally {
			setIsLoading(false);
		}
	};

	// =====================================================
	// Pagination handlers
	// =====================================================

	const handlePageSubmit = () => {
		const requestedPage = Number(pageInput);

		if (
			!Number.isInteger(requestedPage) ||
			requestedPage < 1
		) {
			setError(
				"Please enter a valid page number."
			);
			return;
		}

		void loadSites(requestedPage);
	};

	const handleRowsChange = (value: number) => {
		const cleanValue =
			Math.min(
				Math.max(value, 1),
				100
			);

		setSiteRows(cleanValue);
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
						setCustomerNo(event.target.value)
					}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							void loadSites(1);
						}
					}}
				/>
			);
		}

		return (
			<select
				value={customerNo}
				disabled={allowedCustomerNos.length === 0}
				onChange={(event) =>
					setCustomerNo(event.target.value)
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
		<div className="sites-screen">
			{/* =================================================
			    Header
			================================================= */}

			<div className="sites-header">
				<div>
					<p className="sites-eyebrow">
						Customer Estate
					</p>

					<h1 className="sites-heading">
						Sites
					</h1>

					{searchedCustomerNo && (
						<p className="sites-subtitle">
							Showing customer{" "}
							<strong className="shown-customerno-heading">
								{searchedCustomerNo}
							</strong>
						</p>
					)}
				</div>

				<div className="sites-customer-search">
					{renderCustomerSelector()}

					<button
						type="button"
						disabled={isLoading || !customerNo}
						onClick={() =>
							void loadSites(1)
						}
					>
						Search
					</button>
				</div>
			</div>

			{/* =================================================
			    Filters
			================================================= */}

			<section className="sites-controls-card">
				<div className="sites-controls-heading">
					<div>
						<p className="sites-section-eyebrow">
							Filters
						</p>

						<h2>Find sites</h2>
					</div>

					<div className="sites-toolbar">
						<label className="sites-toolbar-control">
							<span>Rows</span>

							<input
								type="number"
								min={1}
								max={100}
								value={siteRows}
								onChange={(event) =>
									handleRowsChange(
										Number(event.target.value)
									)
								}
							/>
						</label>
					</div>
				</div>

				<SitesFilterPanel
					filters={filters}
					onFiltersChange={setFilters}
				/>
			</section>

			{/* =================================================
			    Error
			================================================= */}

			{error && (
				<p className="sites-error">
					{error}
				</p>
			)}

			{/* =================================================
			    Sites table
			================================================= */}

			<div className="sites-view">
				<SitesTable
					sites={sites}
					rowsToShow={siteRows}
					onSiteClick={setSelectedSite}
					isLoading={isLoading}
				/>
			</div>

			{/* =================================================
			    Pagination
			================================================= */}

			<div className="sites-pagination">
				<button
					type="button"
					className="pagination-button"
					disabled={page <= 1 || isLoading}
					onClick={() =>
						void loadSites(page - 1)
					}
				>
					‹
				</button>

				<div className="page-jump">
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
						disabled={isLoading}
						onClick={handlePageSubmit}
					>
						Go
					</button>
				</div>

				<button
					type="button"
					className="pagination-button"
					disabled={!hasMore || isLoading}
					onClick={() =>
						void loadSites(page + 1)
					}
				>
					›
				</button>
			</div>

			{/* =================================================
			    Site details
			================================================= */}

			{selectedSite && (
				<SiteDetailsModal
					site={selectedSite}
					onClose={() =>
						setSelectedSite(null)
					}
				/>
			)}
		</div>
	);
};

export default Sites;