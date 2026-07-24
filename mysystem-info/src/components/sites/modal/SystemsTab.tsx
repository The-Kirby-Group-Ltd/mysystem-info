import { useEffect, useState } from "react";
import type { Site } from "../../../data/types/siteTypes";
import type {
	SiteSystem,
	SiteSystemsFilters,
} from "../../../data/types/systemsTypes";
import { systemsApi } from "../../../data/api/systemsApi";

type SystemsTabProps = {
	site: Site;
	isLoading?: boolean;
};

const SystemsTab = ({
	site,
	isLoading: isSiteLoading = false,
}: SystemsTabProps) => {
	const siteId = site.siteId.trim().toUpperCase();

	const [systemsList, setSystemsList] = useState<SiteSystem[]>([]);
	const [selectedSystemNo, setSelectedSystemNo] =
		useState<number>(1);

	const [showDecommissioned, setShowDecommissioned] =
		useState(false);

	const [isLoadingSystems, setIsLoadingSystems] =
		useState(false);

	const [systemsError, setSystemsError] = useState("");

	const [systemsListFilters, setSystemsListFilters] =
		useState<SiteSystemsFilters>({
			systemNo: 0,
			siteId: siteId,
			systemCode: "",
			status: "L",
		});

	const selectedSystem =
		systemsList.find(
			(system) => system.systemNo === selectedSystemNo
		) ?? null;

	useEffect(() => {
		setSystemsListFilters((currentFilters) => ({
			...currentFilters,
			SiteId: siteId,
			Status: showDecommissioned ? "" : "L",
		}));
	}, [siteId, showDecommissioned]);

	useEffect(() => {
		let isCancelled = false;

		const loadSystems = async () => {
			if (!siteId) {
				setSystemsError("Site ID could not be retrieved.");
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

				const systemOneExists = result.items.some(
					(system) => system.systemNo === 1
				);

				if (systemOneExists) {
					setSelectedSystemNo(1);
				} else if (result.items.length > 0) {
					setSelectedSystemNo(result.items[0].systemNo);
				} else {
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

	const getSystemStatusLabel = (status: string): string => {
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

	return (
		<div className="site-systems-tab">
			{(isSiteLoading || isLoadingSystems) && (
				<p className="site-modal-loading">
					Loading systems details...
				</p>
			)}

			{systemsError && (
				<div className="site-modal-error" role="alert">
					<p>{systemsError}</p>
				</div>
			)}

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
									{system.systemCode || "Unknown code"}
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

						<span>Show decommissioned systems</span>
					</label>
				</div>
			</section>

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
							<span>System Code</span>
							<strong>
								{selectedSystem.systemCode || "—"}
							</strong>
						</div>

						<div className="site-detail-field">
							<span>Status</span>
							<strong>
                                <span
                                    className={
                                        selectedSystem.status === "L"
                                            ? "system-status system-status-live"
                                            : "system-status system-status-dead"
                                    }
                                >
                                    {getSystemStatusLabel(selectedSystem.status)}
                                </span>
                            </strong>
						</div>

						<div className="site-detail-field">
							<span>Maintained</span>
							<strong>
                                <span
                                    className={
                                        selectedSystem.maintained_YN === "Y"
                                            ? "system-maintained system-maintained-yes"
                                            : "system-maintained system-maintained-no"
                                    }
                                >
                                    {getMaintainedLabel(selectedSystem.maintained_YN)}
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
							<span>Next Maintenance</span>
							<strong>
								{formatDate(
									selectedSystem.nextMaintenanceDate
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