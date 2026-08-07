type CallsDashboardBoardProps = {
	customerNo: string;
	siteId: string;
};

const CallsDashboardBoard = ({
	customerNo,
	siteId,
}: CallsDashboardBoardProps) => {
	return (
		<>
			<div className="dashboard-kpi-grid">
				<div className="dashboard-kpi-card">
					<span>Open Calls</span>
					<strong>—</strong>
					<p>
						Calls currently awaiting completion.
					</p>
				</div>

				<div className="dashboard-kpi-card">
					<span>Completed Calls</span>
					<strong>—</strong>
					<p>
						Completed calls for the selected
						period.
					</p>
				</div>

				<div className="dashboard-kpi-card">
					<span>Further Action</span>
					<strong>—</strong>
					<p>
						Calls requiring additional work.
					</p>
				</div>
			</div>

			<div className="dashboard-chart-placeholder">
				<div>
					<h4>Call Activity</h4>

					<p>
						Call activity charts for{" "}
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

export default CallsDashboardBoard;