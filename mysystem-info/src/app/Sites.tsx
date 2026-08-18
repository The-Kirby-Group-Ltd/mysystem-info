import "../styles/app-styles/sites/Sites.css";
import SitesFilterPanel from "../components/sites/SitesFilterPanel";
import SitesTable from "../components/sites/SitesTable";
import SiteDetailsModal from "../components/sites/SiteDetailsModal";
import { useState } from "react";
import { sitesApi } from "../data/api/sitesApi";
import type { Site, SiteFilters } from "../data/types/siteTypes";
import { getStoredCustomerNo, setStoredCustomerNo } from "../data/storage/customerStorage";

const Sites = () => {
	const [customerNo, setCustomerNo] = useState(
		() => getStoredCustomerNo()
	);
	const [searchedCustomerNo, setSearchedCustomerNo] = useState("");

	const [filters, setFilters] = useState<SiteFilters>({
		siteId: "",
		propertyReferenceNo: "",
		postCode: "",
		status: "",
	});

	const [sites, setSites] = useState<Site[]>([]);
	const [selectedSite, setSelectedSite] = useState<Site | null>(null);

	const [page, setPage] = useState(1);
	const [pageInput, setPageInput] = useState("1");
	const [siteRows, setSiteRows] = useState(10);
	const [hasMore, setHasMore] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const loadSites = async (pageToLoad = 1) => {
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
			setStoredCustomerNo(cleanCustomerNo);
			setCustomerNo(cleanCustomerNo);
			setSearchedCustomerNo(cleanCustomerNo);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load sites.");
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

		loadSites(requestedPage);
	};

	const handleRowsChange = (value: number) => {
		const cleanValue = Math.min(Math.max(value, 1), 100);
		setSiteRows(cleanValue);
	};

	return (
		<div className="sites-screen">
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
								{searchedCustomerNo.toUpperCase()}
							</strong>
						</p>
					)}
				</div>

				<div className="sites-customer-search">
					<input
						type="text"
						placeholder="Customer No"
						value={customerNo}
						onChange={(e) => setCustomerNo(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								loadSites(1);
							}
						}}
					/>

					<button type="button" onClick={() => loadSites(1)}>
						Search
					</button>
				</div>
			</div>

			<section className="sites-controls-card">
				<div className="sites-controls-heading">
					<div>
						<p className="sites-section-eyebrow">
							Filters
						</p>

						<h2>
							Find sites
						</h2>
					</div>

					<div className="sites-toolbar">
						<label className="sites-toolbar-control">
							<span>Rows</span>

							<input
								type="number"
								min={1}
								max={100}
								value={siteRows}
								onChange={(e) =>
									handleRowsChange(
										Number(e.target.value)
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

			{error && <p className="sites-error">{error}</p>}

			<div className="sites-view">
				<SitesTable
					sites={sites}
					rowsToShow={siteRows}
					onSiteClick={setSelectedSite}
					isLoading={isLoading}
				/>
			</div>

			<div className="sites-pagination">
				<button
					type="button"
					className="pagination-button"
					disabled={page <= 1 || isLoading}
					onClick={() => loadSites(page - 1)}
				>
					‹
				</button>

				<div className="page-jump">
					<span>Page</span>
					<input
						type="number"
						min={1}
						value={pageInput}
						onChange={(e) => setPageInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
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
					className="pagination-button"
					disabled={!hasMore || isLoading}
					onClick={() => loadSites(page + 1)}
				>
					›
				</button>
			</div>

			{selectedSite && (
				<SiteDetailsModal
					site={selectedSite}
					onClose={() => setSelectedSite(null)}
				/>
			)}
		</div>
	);
};

export default Sites;
