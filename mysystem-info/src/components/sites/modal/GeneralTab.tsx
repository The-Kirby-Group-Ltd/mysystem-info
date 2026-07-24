import type { Site } from "../../../data/types/siteTypes";

type GeneralTabProps = {
	site: Site;
	isLoading?: boolean;
};

const GeneralTab = ({
	site,
	isLoading = false,
}: GeneralTabProps) => {
	const addressParts = [
		site.add1,
		site.add2,
		site.add3,
		site.add4,
		site.postCode,
	].filter((part): part is string => Boolean(part?.trim()));

	const statusLabel =
		site.status === "L"
			? "Live"
			: site.status === "D"
				? "Dead"
				: site.status || "Unknown";

	const statusClass =
		site.status === "L"
			? "site-modal-status site-modal-status-live"
			: site.status === "D"
				? "site-modal-status site-modal-status-dead"
				: "site-modal-status";

	return (
		<div className="site-general-tab">
			{isLoading && (
				<p className="site-modal-loading">
					Loading full site details...
				</p>
			)}

			<section className="site-detail-section">
				<h3>General information</h3>

				<div className="site-detail-grid">
					<div className="site-detail-field">
						<span>Customer No</span>
						<strong>{site.customerNo || "—"}</strong>
					</div>

					<div className="site-detail-field">
						<span>Site ID</span>
						<strong>{site.siteId || "—"}</strong>
					</div>

					<div className="site-detail-field">
						<span>Status</span>

						<strong>
							<span className={statusClass}>
								{statusLabel}
							</span>
						</strong>
					</div>

					<div className="site-detail-field">
						<span>Property Reference</span>

						<strong>
							{site.propertyReferenceNo ||
								(isLoading ? "Loading…" : "—")}
						</strong>
					</div>

					<div className="site-detail-field site-detail-field-wide">
						<span>Site Name</span>
						<strong>{site.siteName || "—"}</strong>
					</div>

					<div className="site-detail-field site-detail-field-wide">
						<span>Account Name</span>
						<strong>{site.name || "—"}</strong>
					</div>
				</div>
			</section>

			<section className="site-detail-section">
				<h3>Address</h3>

				{addressParts.length > 0 ? (
					<address className="site-modal-address">
						{addressParts.map((part, index) => (
							<span key={`${part}-${index}`}>
								{part}
							</span>
						))}
					</address>
				) : (
					<p className="site-modal-empty">
						No address is available.
					</p>
				)}
			</section>
		</div>
	);
};

export default GeneralTab;