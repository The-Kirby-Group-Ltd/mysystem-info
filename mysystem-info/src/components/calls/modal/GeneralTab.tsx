import { useEffect, useState } from "react";
import type { Call } from "../../../data/types/callTypes";
import type { Site } from "../../../data/types/siteTypes";
import referenceApi from "../../../data/api/referenceApi";
import sitesApi from "../../../data/api/sitesApi";

type GeneralTabProps = {
	call: Call;
	isLoadingCall?: boolean;
    onSiteClick: (siteId: string) => void;
};

const GeneralTab = ({
	call,
	isLoadingCall = false,
    onSiteClick,
}: GeneralTabProps) => {
	const [associatedCustomerNo, setAssociatedCustomerNo] =
		useState("");

	const [callTypeLabel, setCallTypeLabel] = useState("");
	const [callStatusLabel, setCallStatusLabel] = useState("");
	const [systemTypeLabel, setSystemTypeLabel] = useState("");
	const [engineerName, setEngineerName] = useState("");

    const [selectedSite, setSelectedSite] = useState<Site | null>(null);

	const [isLoadingReferenceData, setIsLoadingReferenceData] =
		useState(false);

	const [isLoadingCustomerNo, setIsLoadingCustomerNo] =
		useState(false);

	const [error, setError] = useState("");

	// =====================================================
	// Load call reference descriptions
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const getCallReferenceData = async () => {
			setIsLoadingReferenceData(true);
			setError("");

			// local mappings
			setCallTypeLabel(call.callType || "Unknown");
            setCallStatusLabel(call.callStatus || "Unknown");

			try {
				const cleanSystemType =
					call.systemType?.trim().toUpperCase() ?? "";

				const cleanEngineer =
					call.engineer?.trim().toUpperCase() ?? "";

				if (cleanSystemType) {
					const systemTypeResponse =
						await referenceApi.getSystemTypes({
							code: cleanSystemType,
							pageSize: 1,
						});

					if (!isCancelled) {
						setSystemTypeLabel(
							systemTypeResponse.items[0]?.description?.trim() ||
								cleanSystemType
						);
					}
				} else if (!isCancelled) {
					setSystemTypeLabel("System Type Unknown");
				}

				if (cleanEngineer) {
					const engineerResponse =
						await referenceApi.getEngineers({
							code: cleanEngineer,
							pageSize: 1,
						});

					if (!isCancelled) {
						setEngineerName(
							engineerResponse.items[0]?.description?.trim() ||
								cleanEngineer
						);
					}
				} else if (!isCancelled) {
					setEngineerName("—");
				}
			} catch (error) {
				if (!isCancelled) {
					setSystemTypeLabel(call.systemType || `Unknown`);
					setEngineerName(call.engineer || "—");

					setError(
						error instanceof Error
							? `Unable to load reference data: ${error.message}`
							: "Unable to load reference data."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingReferenceData(false);
				}
			}
		};

		getCallReferenceData();

		return () => {
			isCancelled = true;
		};
	}, [
		call.callType,
		call.callStatus,
		call.systemType,
		call.engineer,
	]);

	// =====================================================
	// Load customer number from the call's site
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const getAssociatedCustomerNo = async () => {
			const cleanSiteId =
				call.siteId?.trim().toUpperCase() ?? "";

			if (!cleanSiteId) {
				setAssociatedCustomerNo("");
				return;
			}

			setIsLoadingCustomerNo(true);

			try {
				const associatedSite =
					await sitesApi.getSiteById(cleanSiteId);

				if (!isCancelled) {
					setAssociatedCustomerNo(
						associatedSite.customerNo?.trim() ?? ""
					);
				}
			} catch (error) {
				if (!isCancelled) {
					setAssociatedCustomerNo("");

					setError(
						error instanceof Error
							? error.message
							: "Customer No could not be retrieved."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingCustomerNo(false);
				}
			}
		};

		getAssociatedCustomerNo();

		return () => {
			isCancelled = true;
		};
	}, [call.siteId]);

	return (
		<div className="call-general-tab">
			{(isLoadingCall ||
				isLoadingReferenceData ||
				isLoadingCustomerNo) && (
				<p className="call-modal-loading">
					Loading full call details...
				</p>
			)}

			<section className="call-detail-section">
				<h3>Call Information</h3>

				{error && (
					<div className="call-modal-error" role="alert">
						<p>{error}</p>
					</div>
				)}

				<div className="call-detail-grid">
					<div className="call-detail-field">
						<span>Customer No</span>
						<strong>
							{associatedCustomerNo || "—"}
						</strong>
					</div>

                    <div className="call-detail-field">
                        <span>Site ID</span>
                        <strong>
                            <button
                                type="button"
                                className="call-site-link"
                                onClick={() => onSiteClick(call.siteId)}
                            >
                                {call.siteId}
                            </button>
                        </strong>
                    </div>

					<div className="call-detail-field">
						<span>Call Type</span>
						<strong>{callTypeLabel || "—"}</strong>
					</div>

					<div className="call-detail-field">
						<span>Call Status</span>
						<strong>{callStatusLabel || "—"}</strong>
					</div>

					<div className="call-detail-field">
						<span>System Type</span>
						<strong>{systemTypeLabel || "—"}</strong>
					</div>

					<div className="call-detail-field">
						<span>Engineer</span>
						<strong>{engineerName || "—"}</strong>
					</div>
				</div>
			</section>
		</div>
	);
};

export default GeneralTab;