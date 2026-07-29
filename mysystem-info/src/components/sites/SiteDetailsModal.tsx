import { useEffect, useState } from "react";
import type { Site } from "../../data/types/siteTypes";
import { sitesApi } from "../../data/api/sitesApi";
import "../../styles/app-styles/SiteModal.css";
import GeneralTab from "./modal/GeneralTab";
import SystemsTab from "./modal/SystemsTab";
import CallHistoryTab from "./modal/CallHistoryTab";

type SiteDetailsModalProps = {
	site: Site;
	onClose: () => void;
};

type SiteModalTab = 
	| "general" 
	| "systems" 
	| "charges" 
	| "callHistory";

const SiteDetailsModal = ({
	site,
	onClose,
}: SiteDetailsModalProps) => {
	const [activeTab, setActiveTab] =
		useState<SiteModalTab>("general");

	// Start with the summary record so the modal can render immediately.
	const [siteDetails, setSiteDetails] = useState<Site>(site);
	const [isLoadingSite, setIsLoadingSite] = useState(true);
	const [siteError, setSiteError] = useState("");

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		const previousOverflow = document.body.style.overflow;

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	useEffect(() => {
		let isCancelled = false;

		const loadSiteDetails = async () => {
			setIsLoadingSite(true);
			setSiteError("");

			try {
				const fullSite = await sitesApi.getSiteById(site.siteId);

				if (!isCancelled) {
					setSiteDetails(fullSite);
				}
			} catch (error) {
				if (!isCancelled) {
					setSiteError(
						error instanceof Error
							? error.message
							: "Failed to load the full site details."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingSite(false);
				}
			}
		};

		setSiteDetails(site);
		setActiveTab("general");
		loadSiteDetails();

		return () => {
			isCancelled = true;
		};
	}, [site]);

	return (
		<div
			className="site-modal-backdrop"
			role="presentation"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<section
				className="site-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="site-modal-title"
				onMouseDown={(event) => event.stopPropagation()}
			>
				<header className="site-modal-header">
					<div>
						<p className="site-modal-eyebrow">
							Site Details
						</p>

						<h2 id="site-modal-title">
							{siteDetails.siteId}
						</h2>

						<p className="site-modal-site-name">
							{siteDetails.siteName ||
								siteDetails.name ||
								"Unnamed site"}
						</p>
					</div>

					<button
						type="button"
						className="site-modal-close"
						onClick={onClose}
						aria-label="Close site"
					>
						×
					</button>
				</header>

				<nav
					className="site-modal-tabs"
					aria-label="Site details sections"
				>
					<button
						type="button"
						className={
							activeTab === "general"
								? "site-modal-tab site-modal-tab-active"
								: "site-modal-tab"
						}
						onClick={() => setActiveTab("general")}
					>
						General
					</button>

					<button
						type="button"
						className={
							activeTab === "systems"
								? "site-modal-tab site-modal-tab-active"
								: "site-modal-tab"
						}
						onClick={() => setActiveTab("systems")}
					>
						Systems
					</button>

					<button
						type="button"
						className={
							activeTab === "charges"
								? "site-modal-tab site-modal-tab-active"
								: "site-modal-tab"
						}
						onClick={() => setActiveTab("charges")}
					>
						Charges
					</button>

                    <button
                        type="button"
                        className={
                            activeTab === "callHistory"
                                ? "site-modal-tab site-modal-tab-active"
                                : "site-modal-tab"
                        }
                        onClick={() => setActiveTab("callHistory")}
                    >
                        Call History
                    </button>
				</nav>

				<div className="site-modal-content">
					{siteError && (
						<div
							className="site-modal-error"
							role="alert"
						>
							<p>{siteError}</p>

							<p>
								The summary information from the sites
								list is being shown instead.
							</p>
						</div>
					)}

					{/* tab imports */}

					{activeTab === "general" && (
						<GeneralTab
							site={siteDetails}
							isLoading={isLoadingSite}
						/>
					)}

					{activeTab === "systems" && (
						<SystemsTab site={siteDetails} />
					)}

					{activeTab === "charges" && (
						<section className="site-detail-section">
							<h3>Charges</h3>

							<p className="site-modal-empty">
								Site and system charge information will
								appear here once the available API fields
								and billing rules have been confirmed.
							</p>
						</section>
					)}

                    {activeTab === "callHistory" && (
						<CallHistoryTab site={siteDetails} />
					)}
				</div>
			</section>
		</div>
	);
};

export default SiteDetailsModal;