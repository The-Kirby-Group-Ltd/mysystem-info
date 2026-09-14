import type {
	DashboardSelect,
} from "../../../data/types/dashboardTypes";

type DashboardSelectorProps = {
	selectedDashboard: DashboardSelect;
	slaAvailable: boolean;

	onSelect: (
		dashboard: DashboardSelect
	) => void;
};

const DashboardSelector = ({
	selectedDashboard,
	slaAvailable,
	onSelect,
}: DashboardSelectorProps) => {
	return (
		<aside className="dashboard-board-select-area">
			<div className="dashboard-selector-heading">
				<span>
					Dashboard View
				</span>

				<p>
					Select the information you want to
					focus on.
				</p>
			</div>

			<div className="dashboard-selector-buttons">
				{/* =================================================
				    Calls
				================================================= */}

				<button
					className={
						selectedDashboard === "calls"
							? "board-select-button board-select-button-active"
							: "board-select-button"
					}
					type="button"
					onClick={() =>
						onSelect("calls")
					}
				>
					<span>
						Calls
					</span>

					<small>
						Call volumes and current statuses
					</small>
				</button>

				{/* =================================================
				    Maintenance
				================================================= */}

				<button
					className={
						selectedDashboard ===
							"system-maintenance"
							? "board-select-button board-select-button-active"
							: "board-select-button"
					}
					type="button"
					onClick={() =>
						onSelect(
							"system-maintenance"
						)
					}
				>
					<span>
						Maintenance
					</span>

					<small>
						System maintenance and upcoming
						visits
					</small>
				</button>

				{/* =================================================
				    SLA
				================================================= */}

				{slaAvailable && (
					<button
						className={
							selectedDashboard === "sla"
								? "board-select-button board-select-button-active"
								: "board-select-button"
						}
						type="button"
						onClick={() =>
							onSelect("sla")
						}
					>
						<span>
							SLA
						</span>

						<small>
							Response targets and performance
						</small>
					</button>
				)}
			</div>
		</aside>
	);
};

export default DashboardSelector;