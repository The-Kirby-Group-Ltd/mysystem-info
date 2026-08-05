import { useEffect, useState } from "react";

import type { Site } from "../../../data/types/siteTypes";
import type {
	SiteSystem,
	SiteSystemsFilters,
} from "../../../data/types/systemsTypes";
import type { SystemTypeReference } from "../../../data/types/referenceTypes";

import { systemsApi } from "../../../data/api/systemsApi";
import { referenceApi } from "../../../data/api/referenceApi";

type SystemsTabProps = {
	site: Site;
	isLoading?: boolean;
};

const SystemsTab = ({
	site,
	isLoading: isSiteLoading = false,
}: SystemsTabProps) => {
	// Normalised site ID used by all site-system API requests.
	const siteId = site.siteId.trim().toUpperCase();

	// =====================================================
	// Systems list and current selection
	// =====================================================

	const [systemsList, setSystemsList] = useState<SiteSystem[]>([]);

	const [selectedSystemNo, setSelectedSystemNo] =
		useState<number>(1);

	const selectedSystem =
		systemsList.find(
			(system) => system.systemNo === selectedSystemNo
		) ?? null;

	// =====================================================
	// System-type reference data
	// =====================================================

	const [systemTypes, setSystemTypes] = useState<
		SystemTypeReference[]
	>([]);

	// =====================================================
	// Filters
	// =====================================================

	const [showDecommissioned, setShowDecommissioned] =
		useState(false);

	const [systemsListFilters, setSystemsListFilters] =
		useState<SiteSystemsFilters>({
			systemNo: 0,
			siteId,
			systemCode: "",
			status: "L",
		});

	// =====================================================
	// Loading state
	// =====================================================

	const [isLoadingSystems, setIsLoadingSystems] =
		useState(false);

	const [isLoadingReferences, setIsLoadingReferences] =
		useState(false);

	const [isLoadingMaintenance, setIsLoadingMaintenance] =
		useState(false);

	// =====================================================
	// Error state
	// =====================================================

	const [systemsError, setSystemsError] = useState("");
	const [referencesError, setReferencesError] = useState("");
	const [maintenanceError, setMaintenanceError] = useState("");

	// =====================================================
	// Maintenance schedule state
	// =====================================================

	const [nextMaintenanceDate, setNextMaintenanceDate] =
		useState("");

	// =====================================================
	// Display helpers
	// =====================================================

	const getSystemDescription = (
		systemCode: string
	): string => {
		const cleanCode = systemCode.trim().toUpperCase();

		const matchingSystemType = systemTypes.find(
			(systemType) =>
				systemType.code.trim().toUpperCase() === cleanCode
		);

		return (
			matchingSystemType?.description ||
			systemCode ||
			"Unknown system"
		);
	};

	// =====================================================
	// Keep filters synchronised with the current site and checkbox
	// =====================================================

	useEffect(() => {
		setSystemsListFilters((currentFilters) => ({
			...currentFilters,
			siteId,
			status: showDecommissioned ? "" : "L",
		}));
	}, [siteId, showDecommissioned]);

	// =====================================================
	// Load all system-type reference records
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadSystemTypes = async () => {
			setIsLoadingReferences(true);
			setReferencesError("");

			try {
				const allSystemTypes: SystemTypeReference[] = [];

				let page = 1;
				let hasMore = true;

				while (hasMore) {
					const response =
						await referenceApi.getSystemTypes({
							page,
							pageSize: 100,
						});

					allSystemTypes.push(...response.items);
					hasMore = response.hasMore;
					page++;
				}

				if (!isCancelled) {
					setSystemTypes(allSystemTypes);
				}
			} catch (error) {
				if (!isCancelled) {
					setSystemTypes([]);

					setReferencesError(
						error instanceof Error
							? error.message
							: "Failed to load system descriptions."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingReferences(false);
				}
			}
		};

		loadSystemTypes();

		// Prevent state updates after the component unmounts.
		return () => {
			isCancelled = true;
		};
	}, []);

	// =====================================================
	// Load systems for the selected site
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadSystems = async () => {
			if (!siteId) {
				setSystemsError(
					"Site ID could not be retrieved."
				);
				return;
			}

			setIsLoadingSystems(true);
			setSystemsError("");

			try {
				const result = await systemsApi.getSystems(
					systemsListFilters.systemNo,
					systemsListFilters.siteId,
					systemsListFilters.systemCode,
					systemsListFilters.status,
					"",
					1,
					100
				);

				if (isCancelled) {
					return;
				}

				setSystemsList(result.items);

				// Prefer system 1 as the default selection.
				const systemOneExists = result.items.some(
					(system) => system.systemNo === 1
				);

				if (systemOneExists) {
					setSelectedSystemNo(1);
				} else if (result.items.length > 0) {
					// If system 1 does not exist, select the
					// first system returned by the API.
					setSelectedSystemNo(
						result.items[0].systemNo
					);
				} else {
					// No systems were returned.
					setSelectedSystemNo(0);
				}
			} catch (error) {
				if (!isCancelled) {
					setSystemsList([]);
					setSelectedSystemNo(0);

					setSystemsError(
						error instanceof Error
							? error.message
							: "Failed to load systems."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingSystems(false);
				}
			}
		};

		loadSystems();

		return () => {
			isCancelled = true;
		};
	}, [siteId, systemsListFilters]);

	// =====================================================
	// Load the selected system's next maintenance date
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadMaintenanceSchedule = async () => {
			// Reset the previous system's date immediately.
			setNextMaintenanceDate("—")
			setMaintenanceError("");

			// The systems request may not have completed yet.
			if (!selectedSystem) {
				return;
			}

			// Non-maintained systems do not require a schedule request.
			if (
				selectedSystem.maintained_YN
					.trim()
					.toUpperCase() !== "Y"
			) {
				return;
			}

			setIsLoadingMaintenance(true);

			try {
				const response =
					await systemsApi.getSystemMaintenanceSchedule(
						selectedSystem
					);

				if (isCancelled) {
					return;
				}

				// The request is for one site/system combination,
				// so use the first returned schedule.
				const schedule = response.items[0];

				setNextMaintenanceDate(
					schedule?.nextMaintenanceDate || "-"
				);
			} catch (error) {
				if (!isCancelled) {
					setNextMaintenanceDate("-");

					setMaintenanceError(
						error instanceof Error
							? error.message
							: "Failed to load the maintenance schedule."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingMaintenance(false);
				}
			}
		};

		// This call was missing from the previous version.
		loadMaintenanceSchedule();

		return () => {
			isCancelled = true;
		};
	}, [selectedSystem]);

	// =====================================================
	// Formatting helpers
	// =====================================================

	// Convert an API date such as 2026-07-27T00:00:00
	// into the British display format 27/07/2026.
	const formatDate = (
		value: string | null | undefined
	): string => {
		if (!value) {
			return "—";
		}

		const datePart = value.split("T")[0];
		const [year, month, day] = datePart.split("-");

		if (!year || !month || !day) {
			return value;
		}

		return `${day}/${month}/${year}`;
	};

	const getSystemStatusLabel = (
		status: string
	): string => {
		switch (status.trim().toUpperCase()) {
			case "L":
				return "Live";

			case "D":
				return "Decommissioned";

			default:
				return status || "Unknown";
		}
	};

	const getMaintainedLabel = (
		maintainedYN: string
	): string => {
		switch (maintainedYN.trim().toUpperCase()) {
			case "Y":
				return "Yes";

			case "N":
				return "No";

			default:
				return maintainedYN || "—";
		}
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="site-systems-tab">
			{/* Shared loading message for site, systems,
			    reference and maintenance requests. */}
			{(isSiteLoading ||
				isLoadingSystems ||
				isLoadingReferences ||
				isLoadingMaintenance) && (
				<p className="site-modal-loading">
					Loading systems details...
				</p>
			)}

			{/* Systems request failure. */}
			{systemsError && (
				<div
					className="site-modal-error"
					role="alert"
				>
					<p>{systemsError}</p>
				</div>
			)}

			{/* Reference failure does not prevent systems from
			    displaying; raw system codes are used instead. */}
			{referencesError && (
				<div
					className="site-modal-error"
					role="alert"
				>
					<p>{referencesError}</p>
					<p>
						System codes will be displayed instead.
					</p>
				</div>
			)}

			{/* Maintenance failure affects only the next-date field. */}
			{maintenanceError && (
				<div
					className="site-modal-error"
					role="alert"
				>
					<p>{maintenanceError}</p>
					<p>
						The next maintenance date is unavailable.
					</p>
				</div>
			)}

			{/* System selection controls. */}
			<section className="site-detail-section">
				<h3>Systems Information</h3>

				<div className="system-selection-controls">
					<label className="system-selection-dropdown">
						<span>System</span>

						<select
							value={selectedSystemNo}
							onChange={(event) =>
								setSelectedSystemNo(
									Number(event.target.value)
								)
							}
							disabled={
								isLoadingSystems ||
								systemsList.length === 0
							}
						>
							{systemsList.length === 0 && (
								<option value={0}>
									No systems available
								</option>
							)}

							{systemsList.map((system) => (
								<option
									key={system.systemNo}
									value={system.systemNo}
								>
									System {system.systemNo} —{" "}
									{getSystemDescription(
										system.systemCode
									)}
									{system.systemCode
										? ` (${system.systemCode})`
										: ""}
									{system.status === "D"
										? " (Decommissioned)"
										: ""}
								</option>
							))}
						</select>
					</label>

					<label className="system-show-decommissioned">
						<input
							type="checkbox"
							checked={showDecommissioned}
							onChange={(event) =>
								setShowDecommissioned(
									event.target.checked
								)
							}
						/>

						<span>
							Show decommissioned systems
						</span>
					</label>
				</div>
			</section>

			{/* Details for the system selected in the dropdown. */}
			<section className="site-detail-section system-detail-section">
				<h3>System Details</h3>

				{selectedSystem ? (
					<div className="site-detail-grid">
						<div className="site-detail-field">
							<span>System No.</span>
							<strong>
								{selectedSystem.systemNo}
							</strong>
						</div>

						<div className="site-detail-field">
							<span>System Type Reference</span>
							<strong>
								{selectedSystem.systemCode ||
									"—"}
							</strong>
						</div>

						<div className="site-detail-field site-detail-field-wide">
							<span>System Type</span>
							<strong>
								{getSystemDescription(
									selectedSystem.systemCode
								)}
							</strong>
						</div>

						<div className="site-detail-field">
							<span>Status</span>

							<strong>
								<span
									className={
										selectedSystem.status ===
										"L"
											? "system-status system-status-live"
											: "system-status system-status-dead"
									}
								>
									{getSystemStatusLabel(
										selectedSystem.status
									)}
								</span>
							</strong>
						</div>

						<div className="site-detail-field">
							<span>Maintained</span>

							<strong>
								<span
									className={
										selectedSystem.maintained_YN ===
										"Y"
											? "system-maintained system-maintained-yes"
											: "system-maintained system-maintained-no"
									}
								>
									{getMaintainedLabel(
										selectedSystem.maintained_YN
									)}
								</span>
							</strong>
						</div>

						<div className="site-detail-field">
							<span>Commissioned Date</span>
							<strong>
								{formatDate(
									selectedSystem.commissionedDate
								)}
							</strong>
						</div>

						<div className="site-detail-field">
							<span>Last Maintenance</span>
							<strong>
								{formatDate(
									selectedSystem.lastMaintenanceDate
								)}
							</strong>
						</div>

						<div className="site-detail-field">
							<span>Next Maintenance Due</span>
							<strong>
								{isLoadingMaintenance
									? "Loading..."
									: formatDate(
											nextMaintenanceDate
										)}
							</strong>
						</div>
					</div>
				) : (
					<p className="site-modal-empty">
						No systems are available for this site.
					</p>
				)}
			</section>
		</div>
	);
};

export default SystemsTab;