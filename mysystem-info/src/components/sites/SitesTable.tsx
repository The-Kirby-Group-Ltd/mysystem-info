import type { Site } from "../../data/types/siteTypes";
import "../../styles/app-styles/sites/SitesTable.css";

type SitesTableProps = {
	sites: Site[];
	rowsToShow: number;
	onSiteClick: (site: Site) => void;
	isLoading?: boolean;
};

const SitesTable = ({
	sites,
	rowsToShow,
	onSiteClick,
	isLoading = false,
}: SitesTableProps) => {
	const visibleSites = sites.slice(0, rowsToShow);
	const skeletonRows = Array.from({ length: Math.min(rowsToShow, rowsToShow) });

	return (
		<table className="sites-table">
			<thead>
				<tr>
					<th>Site ID</th>
					<th>Site Name</th>
					<th>Postcode</th>
					<th>Status</th>
				</tr>
			</thead>

			<tbody>
				{isLoading &&
					skeletonRows.map((_, index) => (
						<tr key={`skeleton-${index}`} className="sites-skeleton-row">
							<td>
								<span className="skeleton-block skeleton-short" />
							</td>
							<td>
								<span className="skeleton-block skeleton-long" />
							</td>
							<td>
								<span className="skeleton-block skeleton-medium" />
							</td>
							<td>
								<span className="skeleton-block skeleton-short" />
							</td>
						</tr>
					))}

				{!isLoading &&
					visibleSites.map((site) => (
						<tr key={site.siteId} className="sites-table-row">
							<td>
								<button
									type="button"
									className="site-id-button"
									onClick={(e) => {
										e.stopPropagation();
										onSiteClick(site);
									}}
								>
									{site.siteId}
								</button>
							</td>

							<td>{site.siteName}</td>
							<td>{site.postCode}</td>
							<td>
								<span
									className={
										site.status === "L"
											? "site-status site-status-live"
											: "site-status site-status-dead"
									}
								>
									{site.status === "L" ? "Live" : "Dead"}
								</span>
							</td>
						</tr>
					))}

				{!isLoading && visibleSites.length === 0 && (
					<tr>
						<td colSpan={4} className="sites-empty-row">
							No sites found.
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default SitesTable;