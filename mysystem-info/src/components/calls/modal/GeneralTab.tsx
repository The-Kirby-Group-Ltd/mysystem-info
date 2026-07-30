import { useEffect, useState } from "react";

import type { Call } from "../../../data/types/callTypes";

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
	// Customer number is retrieved through the call's site.
	const [associatedCustomerNo, setAssociatedCustomerNo] =
		useState("");

	// Customer-friendly descriptions for MMAPI reference codes.
	const [systemTypeLabel, setSystemTypeLabel] =
		useState("");

	const [engineerName, setEngineerName] =
		useState("");

	// Loading state for the additional requests made by this tab.
	const [
		isLoadingReferenceData,
		setIsLoadingReferenceData,
	] = useState(false);

	const [
		isLoadingCustomerNo,
		setIsLoadingCustomerNo,
	] = useState(false);

	// Separate lookup errors so the main call details remain usable.
	const [referenceError, setReferenceError] =
		useState("");

	const [customerError, setCustomerError] =
		useState("");

	// =====================================================
	// Date formatting
	// =====================================================

	const formatDate = (
		value: string | null | undefined
	): string => {
		if (!value) {
			return "—";
		}

		const datePart = value.split("T")[0];
		const [year, month, day] =
			datePart.split("-");

		if (!year || !month || !day) {
			return value;
		}

		return `${day}/${month}/${year}`;
	};

	// =====================================================
	// Load system-type and engineer descriptions
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadReferenceData = async () => {
			setIsLoadingReferenceData(true);
			setReferenceError("");

			const cleanSystemType =
				call.systemType
					?.trim()
					.toUpperCase() ?? "";

			const cleanEngineer =
				call.engineer
					?.trim()
					.toUpperCase() ?? "";

			// Raw codes remain useful fallbacks.
			setSystemTypeLabel(
				cleanSystemType ||
					"System Type Unknown"
			);

			setEngineerName(
				cleanEngineer || "—"
			);

			try {
				if (cleanSystemType) {
					const response =
						await referenceApi.getSystemTypes(
							{
								code: cleanSystemType,
								pageSize: 1,
							}
						);

					if (!isCancelled) {
						setSystemTypeLabel(
							response.items[0]
								?.description
								?.trim() ||
								cleanSystemType
						);
					}
				}

				if (cleanEngineer) {
					const response =
						await referenceApi.getEngineers(
							{
								code: cleanEngineer,
								pageSize: 1,
							}
						);

					if (!isCancelled) {
						setEngineerName(
							response.items[0]
								?.description
								?.trim() ||
								cleanEngineer
						);
					}
				}
			} catch (error) {
				if (!isCancelled) {
					setReferenceError(
						error instanceof Error
							? `Unable to load reference data: ${error.message}`
							: "Unable to load reference data."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingReferenceData(
						false
					);
				}
			}
		};

		loadReferenceData();

		return () => {
			isCancelled = true;
		};
	}, [call.systemType, call.engineer]);

	// =====================================================
	// Resolve the call's customer number from its site
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadCustomerNo = async () => {
			const cleanSiteId =
				call.siteId
					?.trim()
					.toUpperCase() ?? "";

			setAssociatedCustomerNo("");
			setCustomerError("");

			if (!cleanSiteId) {
				return;
			}

			setIsLoadingCustomerNo(true);

			try {
				const site =
					await sitesApi.getSiteById(
						cleanSiteId
					);

				if (!isCancelled) {
					setAssociatedCustomerNo(
						site.customerNo?.trim() ??
							""
					);
				}
			} catch (error) {
				if (!isCancelled) {
					setCustomerError(
						error instanceof Error
							? `Unable to load customer information: ${error.message}`
							: "Unable to load customer information."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingCustomerNo(
						false
					);
				}
			}
		};

		loadCustomerNo();

		return () => {
			isCancelled = true;
		};
	}, [call.siteId]);

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="call-general-tab">
			{(isLoadingCall ||
				isLoadingReferenceData ||
				isLoadingCustomerNo) && (
				<p className="call-modal-loading">
					Loading full call details...
				</p>
			)}

			{referenceError && (
				<div
					className="call-modal-error"
					role="alert"
				>
					<p>{referenceError}</p>
					<p>
						Reference codes are being
						displayed instead.
					</p>
				</div>
			)}

			{customerError && (
				<div
					className="call-modal-error"
					role="alert"
				>
					<p>{customerError}</p>
				</div>
			)}

			<section className="call-detail-section">
				<h3>General Information</h3>

				<div className="call-detail-grid">
					<div className="call-detail-field">
						<span>Customer No</span>
						<strong>
							{associatedCustomerNo ||
								"—"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>Site ID</span>

						<strong>
							{call.siteId ? (
								<button
									type="button"
									className="call-site-link"
									onClick={() =>
										onSiteClick(
											call.siteId
										)
									}
								>
									{call.siteId}
								</button>
							) : (
								"—"
							)}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>Call Type</span>
						<strong>
							{call.callType ||
								"Unknown"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>Call Status</span>
						<strong>
							{call.callStatus ||
								"Unknown"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>System Type</span>
						<strong>
							{systemTypeLabel || "—"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>Engineer</span>
						<strong>
							{engineerName || "—"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>Logged Date</span>
						<strong>
							{formatDate(
								call.loggedDate
							)}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>
							Logging Operator
						</span>
						<strong>
							{call.loggingOperator ||
								"—"}
						</strong>
					</div>
				</div>
			</section>

			<section className="call-detail-section">
				<h3>Call Details</h3>

				<div className="call-detail-field">
					<span>Logged Remarks</span>

					<p className="call-modal-remarks">
						{call.loggedRemarks ||
							"No logged remarks are available."}
					</p>
				</div>
			</section>

			<section className="call-detail-section">
				<h3>Completion and Billing</h3>

				<div className="call-detail-grid">
					<div className="call-detail-field">
						<span>Completed Date</span>
						<strong>
							{formatDate(
								call.completedDate
							)}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>Invoice No.</span>
						<strong>
							{call.invoiceNo || "—"}
						</strong>
					</div>

					<div className="call-detail-field call-detail-field-wide">
						<span>
							Customer Reference
						</span>
						<strong>
							{call.customerReference ||
								"—"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>
							Previous Maintenance
						</span>
						<strong>
							{formatDate(
								call.previousMaintenanceDate
							)}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>Next Maintenance</span>
						<strong>
							{formatDate(
								call.nextMaintenanceDate
							)}
						</strong>
					</div>
				</div>
			</section>
		</div>
	);
};

export default GeneralTab;