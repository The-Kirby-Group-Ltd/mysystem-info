type MaintenanceDashboardBoardProps = {
	customerNo: string;
	siteId: string;
};

const MaintenanceDashboardBoard = ({
	customerNo,
	siteId,
}: MaintenanceDashboardBoardProps) => {
	return (
		<>
			<div className="dashboard-kpi-grid">
				<div className="dashboard-kpi-card">
					<span>Maintained Systems</span>
					<strong>—</strong>
					<p>
						Active maintained systems.
					</p>
				</div>

				<div className="dashboard-kpi-card">
					<span>Due Soon</span>
					<strong>—</strong>
					<p>
						Maintenance visits approaching.
					</p>
				</div>

				<div className="dashboard-kpi-card">
					<span>Overdue</span>
					<strong>—</strong>
					<p>
						Systems awaiting maintenance.
					</p>
				</div>
			</div>

			<div className="dashboard-chart-placeholder">
				<div>
					<h4>Maintenance Schedule</h4>

					<p>
						Upcoming maintenance activity for{" "}
						<strong>
							{customerNo || "the selected customer"}
						</strong>{" "}
						will appear here.
					</p>
				</div>
			</div>
		</>
	);
};

export default MaintenanceDashboardBoard;