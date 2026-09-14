import {
	useEffect,
	useState,
} from "react";

import type {
	Call,
} from "../../../data/types/callTypes";

import referenceApi from "../../../data/api/referenceApi";
import sitesApi from "../../../data/api/sitesApi";

import {
	customerHasSla,
} from "../../../data/helpers/slaHelpers";

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
	// =====================================================
	// State
	// =====================================================

	// Customer number is retrieved through the call's site.
	const [associatedCustomerNo, setAssociatedCustomerNo] =
		useState("");

	// Customer-friendly descriptions for MMAPI reference codes.
	const [systemTypeLabel, setSystemTypeLabel] =
		useState("");

	const [engineerName, setEngineerName] =
		useState("");

	const [failureReasonLabel, setFailureReasonLabel] =
		useState("");

	// Loading state for additional requests made by this tab.
	const [
		isLoadingReferenceData,
		setIsLoadingReferenceData,
	] = useState(false);

	const [
		isLoadingCustomerNo,
		setIsLoadingCustomerNo,
	] = useState(false);

	const [
		isLoadingSlaReason,
		setIsLoadingSlaReason,
	] = useState(false);

	// Separate lookup errors so main call details remain usable.
	const [referenceError, setReferenceError] =
		useState("");

	const [customerError, setCustomerError] =
		useState("");

	const [slaError, setSlaError] =
		useState("");

	// =====================================================
	// Derived SLA state
	// =====================================================

	const slaCustomer =
		customerHasSla(
			associatedCustomerNo
		);

	const cleanCallStatus =
		call.callStatus
			?.trim()
			.toUpperCase() ?? "";

	const cleanCallType =
		call.callType
			?.trim()
			.toUpperCase() ?? "";

	const cleanFailedToRespond =
		call.failedToRespond_YN
			?.trim()
			.toUpperCase() ?? "";

	const isCompleted =
		cleanCallStatus === "C" ||
		cleanCallStatus === "COMPLETED" ||
		cleanCallStatus === "COMPLETED (INVOICED)";

	const isMaintenance =
		cleanCallType === "P" ||
		cleanCallType === "PLANNED MAINTENANCE";

	const isSlaApplicable =
		slaCustomer &&
		isCompleted &&
		!isMaintenance;

	const hasBreachedSla =
		isSlaApplicable &&
		cleanFailedToRespond === "Y";

	// =====================================================
	// Date formatting
	// =====================================================

	const formatDate = (
		value: string | null | undefined
	): string => {
		if (!value) {
			return "—";
		}

		const datePart =
			value.split("T")[0];

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

		const loadReferenceData =
			async () => {
				setIsLoadingReferenceData(
					true
				);

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
							await referenceApi
								.getSystemTypes({
									code:
										cleanSystemType,
									pageSize: 1,
								});

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
							await referenceApi
								.getEngineers({
									code:
										cleanEngineer,
									pageSize: 1,
								});

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

		void loadReferenceData();

		return () => {
			isCancelled = true;
		};
	}, [
		call.systemType,
		call.engineer,
	]);

	// =====================================================
	// Resolve the call's customer number from its site
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadCustomerNo =
			async () => {
				const cleanSiteId =
					call.siteId
						?.trim()
						.toUpperCase() ?? "";

				setAssociatedCustomerNo("");
				setCustomerError("");

				if (!cleanSiteId) {
					return;
				}

				setIsLoadingCustomerNo(
					true
				);

				try {
					const site =
						await sitesApi
							.getSiteById(
								cleanSiteId
							);

					if (!isCancelled) {
						setAssociatedCustomerNo(
							site.customerNo
								?.trim()
								.toUpperCase() ??
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

		void loadCustomerNo();

		return () => {
			isCancelled = true;
		};
	}, [call.siteId]);

	// =====================================================
	// Resolve SLA failure reason
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadFailureReason =
			async () => {
				setFailureReasonLabel("");
				setSlaError("");

				const cleanReasonCode =
					call.failedToRespondReason
						?.trim()
						.toUpperCase() ?? "";

				if (
					!slaCustomer ||
					!hasBreachedSla ||
					!cleanReasonCode
				) {
					return;
				}

				setFailureReasonLabel(
					cleanReasonCode
				);

				setIsLoadingSlaReason(
					true
				);

				try {
					const response =
						await referenceApi
							.getFailedToRespondReason(
								cleanReasonCode
							);

					if (!isCancelled) {
						setFailureReasonLabel(
							response.description
								?.trim() ||
								cleanReasonCode
						);
					}
				} catch (error) {
					if (!isCancelled) {
						setSlaError(
							error instanceof Error
								? `Unable to load SLA failure reason: ${error.message}`
								: "Unable to load SLA failure reason."
						);
					}
				} finally {
					if (!isCancelled) {
						setIsLoadingSlaReason(
							false
						);
					}
				}
			};

		void loadFailureReason();

		return () => {
			isCancelled = true;
		};
	}, [
		slaCustomer,
		hasBreachedSla,
		call.failedToRespondReason,
	]);

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="call-general-tab">
			{(
				isLoadingCall ||
				isLoadingReferenceData ||
				isLoadingCustomerNo
			) && (
				<p className="call-modal-loading">
					Loading full call details...
				</p>
			)}

			{referenceError && (
				<div
					className="call-modal-error"
					role="alert"
				>
					<p>
						{referenceError}
					</p>

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
					<p>
						{customerError}
					</p>
				</div>
			)}

			{/* =================================================
			    General information
			================================================= */}

			<section className="call-detail-section">
				<h3>
					General Information
				</h3>

				<div className="call-detail-grid">
					<div className="call-detail-field">
						<span>
							Customer No
						</span>

						<strong>
							{associatedCustomerNo ||
								"—"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>
							Site ID
						</span>

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
						<span>
							Call Type
						</span>

						<strong>
							{call.callType ||
								"Unknown"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>
							Call Status
						</span>

						<strong>
							{call.callStatus ||
								"Unknown"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>
							System Type
						</span>

						<strong>
							{systemTypeLabel ||
								"—"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>
							Engineer
						</span>

						<strong>
							{engineerName ||
								"—"}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>
							Logged Date
						</span>

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

			{/* =================================================
					SLA information
				================================================= */}

				{slaCustomer && (
					<section className="call-detail-section call-sla-section">
						<div className="call-sla-heading">
							<h3>
								SLA Information
							</h3>

							<p>
								Response performance for this call.
							</p>
						</div>

						{isSlaApplicable && (
							<div className="call-detail-grid">
								<div className="call-detail-field">
									<span>
										SLA Result
									</span>

									<strong>
										{hasBreachedSla
											? "Breached"
											: "Within SLA"}
									</strong>
								</div>

								<div className="call-detail-field">
									<span>
										Failed to Respond
									</span>

									<strong>
										{hasBreachedSla
											? "Yes"
											: "No"}
									</strong>
								</div>

								{hasBreachedSla && (
									<div className="call-detail-field call-detail-field-wide">
										<span>
											Failure Reason
										</span>

										<strong>
											{isLoadingSlaReason
												? "Loading..."
												: failureReasonLabel ||
													"No failure reason recorded."}
										</strong>
									</div>
								)}
							</div>
						)}

						{!isCompleted && (
							<p className="call-sla-note">
								SLA reporting only applies to
								completed calls.
							</p>
						)}

						{isCompleted &&
							isMaintenance && (
								<p className="call-sla-note">
									Planned maintenance calls are
									excluded from SLA reporting.
								</p>
							)}

						{slaError && (
							<p className="call-sla-error">
								{slaError}
							</p>
						)}
					</section>
				)}

			{/* =================================================
			    Call details
			================================================= */}

			<section className="call-detail-section">
				<h3>
					Call Details
				</h3>

				<div className="call-detail-field">
					<span>
						Logged Remarks
					</span>

					<p className="call-modal-remarks">
						{call.loggedRemarks ||
							"No logged remarks are available."}
					</p>
				</div>
			</section>

			{/* =================================================
			    Completion and billing
			================================================= */}

			<section className="call-detail-section">
				<h3>
					Completion and Billing
				</h3>

				<div className="call-detail-grid">
					<div className="call-detail-field">
						<span>
							Completed Date
						</span>

						<strong>
							{formatDate(
								call.completedDate
							)}
						</strong>
					</div>

					<div className="call-detail-field">
						<span>
							Invoice No.
						</span>

						<strong>
							{call.invoiceNo ||
								"—"}
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
						<span>
							Next Maintenance
						</span>

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