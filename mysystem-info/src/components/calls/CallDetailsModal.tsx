import { useEffect, useState } from "react";

import type { Call } from "../../data/types/callTypes";
import type { Site } from "../../data/types/siteTypes";

import { callsApi } from "../../data/api/callsApi";
import sitesApi from "../../data/api/sitesApi";

import GeneralTab from "./modal/GeneralTab";
import ActionsTab from "./modal/ActionsTab";
import SiteDetailsModal from "../sites/SiteDetailsModal";

import "../../styles/app-styles/CallModal.css";

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

	// Full call record loaded from the single-call endpoint.
	const [callDetails, setCallDetails] = useState<Call>(call);
	const [isLoadingCall, setIsLoadingCall] = useState(true);
	const [callError, setCallError] = useState("");

	// Site modal opened from the Site ID link in GeneralTab.
	const [selectedSite, setSelectedSite] =
		useState<Site | null>(null);

	const [isLoadingSite, setIsLoadingSite] =
		useState(false);

	const [siteError, setSiteError] = useState("");

	// =====================================================
	// Modal keyboard and document behaviour
	// =====================================================

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				// Close the nested site modal first, if it is open.
				if (selectedSite) {
					setSelectedSite(null);
					return;
				}

				onClose();
			}
		};

		const previousOverflow =
			document.body.style.overflow;

		document.body.style.overflow = "hidden";

		window.addEventListener(
			"keydown",
			handleKeyDown
		);

		return () => {
			document.body.style.overflow =
				previousOverflow;

			window.removeEventListener(
				"keydown",
				handleKeyDown
			);
		};
	}, [onClose, selectedSite]);

	// =====================================================
	// Load full call details
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadCallDetails = async () => {
			setIsLoadingCall(true);
			setCallError("");

			try {
				const fullCall =
					await callsApi.getCallByNumber(
						call.callNumber
					);

				if (!isCancelled) {
					setCallDetails(fullCall);
				}
			} catch (error) {
				if (!isCancelled) {
					// Retain the summary record supplied by the table.
					setCallDetails(call);

					setCallError(
						error instanceof Error
							? error.message
							: "Failed to load the full call details."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingCall(false);
				}
			}
		};

		setCallDetails(call);
		setActiveTab("general");
		setSelectedSite(null);

		loadCallDetails();

		return () => {
			isCancelled = true;
		};
	}, [call]);

	// =====================================================
	// Open the associated site modal
	// =====================================================

	const handleSiteClick = async (
		siteId: string
	) => {
		const cleanSiteId =
			siteId.trim().toUpperCase();

		if (!cleanSiteId) {
			return;
		}

		setIsLoadingSite(true);
		setSiteError("");

		try {
			const site =
				await sitesApi.getSiteById(
					cleanSiteId
				);

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
	// Render
	// =====================================================

	return (
		<div
			className={
				isNested
					? "call-modal-backdrop call-modal-backdrop-nested"
					: "call-modal-backdrop"
			}
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
				className="call-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="call-modal-title"
				onMouseDown={(event) =>
					event.stopPropagation()
				}
			>
				<header className="call-modal-header">
					<div>
						<p className="call-modal-eyebrow">
							Call Details
						</p>

						<h2 id="call-modal-title">
							Call No.{" "}
							{callDetails.callNumber}
						</h2>

						<p className="call-modal-subtitle">
							{callDetails.siteId
								? `Site ${callDetails.siteId}`
								: "Site unavailable"}
						</p>
					</div>

					<button
						type="button"
						className="call-modal-close"
						onClick={onClose}
						aria-label="Close call"
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
						onClick={() =>
							setActiveTab("general")
						}
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
						onClick={() =>
							setActiveTab(
								"callActions"
							)
						}
					>
						Call Actions
					</button>
				</nav>

				<div className="call-modal-content">
					{callError && (
						<div
							className="call-modal-error"
							role="alert"
						>
							<p>{callError}</p>
							<p>
								The summary information
								from the calls list is
								being shown instead.
							</p>
						</div>
					)}

					{siteError && (
						<div
							className="call-modal-error"
							role="alert"
						>
							<p>{siteError}</p>
						</div>
					)}

					{isLoadingSite && (
						<p className="call-modal-loading">
							Loading site details...
						</p>
					)}

					{activeTab === "general" && (
						<GeneralTab
							call={callDetails}
							isLoadingCall={
								isLoadingCall
							}
							onSiteClick={
								handleSiteClick
							}
						/>
					)}

					{activeTab ===
						"callActions" && (
						<ActionsTab />
					)}
				</div>
			</section>

			{selectedSite && (
				<SiteDetailsModal
					site={selectedSite}
					onClose={() =>
						setSelectedSite(null)
					}
					isNested
				/>
			)}
		</div>
	);
};

export default CallDetailsModal;