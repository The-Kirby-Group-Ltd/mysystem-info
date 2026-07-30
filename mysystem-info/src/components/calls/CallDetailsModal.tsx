import { useEffect, useState } from "react";
import type { Call } from "../../data/types/callTypes";
import { callsApi } from "../../data/api/callsApi";
import "../../styles/app-styles/CallModal.css";
import GeneralTab from "./modal/GeneralTab";
import ActionsTab from "./modal/ActionsTab";
import type { Site } from "../../data/types/siteTypes";
import sitesApi from "../../data/api/sitesApi";
import SiteDetailsModal from "../sites/SiteDetailsModal";

type CallDetailsModalProps = {
	call: Call;
	onClose: () => void;
	isNested?: boolean;
};

type CallModalTab = 
	| "general"
	| "callActions";

const CallDetailsModal = ({
	call,
	onClose,
	isNested = false,
}: CallDetailsModalProps) => {
	const [activeTab, setActiveTab] = 
		useState<CallModalTab>("general");

	const [callDetails, setCallDetails] = useState<Call>(call);
	const [isLoadingCall, setIsLoadingCall] = useState(true);
	const [callError, setCallError] = useState("");

	const [selectedSite, setSelectedSite] = useState<Site | null>(null);
	const [isLoadingSite, setIsLoadingSite] = useState(false);
	const [siteError, setSiteError] = useState("");

	// =====================================================
	// Close modal view
	// =====================================================

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

	// =====================================================
	// Load call details from API 
	// =====================================================

	useEffect(() => {
		let isCancelled = false;


		const loadCallDetails = async () => {
			setIsLoadingCall(true);
			setCallError("");

			try { // fetch this call 
				const fullCall = await callsApi.getCallByNumber(call.callNumber);

				if (!isCancelled) {
					setCallDetails(fullCall);
				}
			} catch (error) { // failed to load
				if (!isCancelled) {
					setCallError(
						error instanceof Error
							? error.message
							: "Failed to load the full call details."
					);
				}
			} finally { // set isLoading false 
				if (!isCancelled) {
					setIsLoadingCall(false);
				}
			}
		};

		setCallDetails(call);
		setActiveTab("general");
		loadCallDetails();

		return () => {
			isCancelled = true;
		};
	}, [call]);

	// =====================================================
	// Handle a click on site id in general tab
	// =====================================================

	const handleSiteClick = async (siteId: string) => {
		const cleanSiteId = siteId.trim().toUpperCase();

		if (!cleanSiteId) {
			return;
		}

		setIsLoadingSite(true);
		setSiteError("");

		try {
			const site = await sitesApi.getSiteById(cleanSiteId);
			setSelectedSite(site);
		} catch (error) {
			setSiteError(
				error instanceof Error
					? error.message
					: "Failed to load site details."
			);
		} finally {
			setIsLoadingSite(false);
		}
	};

	// =====================================================
	// Render call modal
	// =====================================================

	return (
		<div 
			className={
				isNested === true
					? "call-modal-backdrop call-modal-backdrop-nested"
					: "call-modal-backdrop"
			}

			// className="call-modal-backdrop"
			role="presentation"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<section
				className="call-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="call-modal-title"
				onMouseDown={(event) => event.stopPropagation()}
			>
				<header className="call-modal-header">
					<div>
						<p className="call-modal-eyebrow">
							Call Details
						</p>

						<h2 id="call-modal-title">
							Call No. {callDetails.callNumber}
						</h2>
					</div>

					<button
						type="button"
						className="call-modal-close"
						onClick={onClose}
						aria-label="Close site"
					>
						×
					</button>
				</header>

				<nav
					className="call-modal-tabs"
					aria-label="Call details sections"
				>
					<button
						type="button"
						className={
							activeTab === "general"
								? "call-modal-tab call-modal-tab-active"
								: "call-modal-tab"
						}
						onClick={() => setActiveTab("general")}
					>
						General
					</button>

					<button
						type="button"
						className={
							activeTab === "callActions"
								? "call-modal-tab call-modal-tab-active"
								: "call-modal-tab"
						}
						onClick={() => setActiveTab("callActions")}
					>
						Call Actions
					</button>
				</nav>

				<div className="call-modal-content">
					{/* error */}

					{callError && (
						<div
							className="call-modal-error"
							role="alert"
						>
							<p>{callError}</p>

							<p>
								The summary information from the calls
								list is being shown instead. 
							</p>
						</div>
					)}

					{/* tab imports */}

					{activeTab === "general" && (
						<GeneralTab 
							call={callDetails}
							isLoadingCall={isLoadingCall}
							onSiteClick={handleSiteClick}
						/>
					)}

					{activeTab === "callActions" && (
						<ActionsTab />
					)}
				</div>
			</section>

			{selectedSite && (
				<SiteDetailsModal
					site={selectedSite}
					onClose={() => setSelectedSite(null)}
					isNested={true}
				/>
			)}
		</div>
	)
};

export default CallDetailsModal;