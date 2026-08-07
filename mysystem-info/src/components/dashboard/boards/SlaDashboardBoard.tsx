type SlaDashboardBoardProps = {
	customerNo: string;
	siteId: string;
};

const SlaDashboardBoard = ({
	customerNo,
	siteId,
}: SlaDashboardBoardProps) => {
	return (
		<>
			<div className="dashboard-kpi-grid">
				<div className="dashboard-kpi-card">
					<span>Within SLA</span>
					<strong>—</strong>
					<p>
						Calls currently meeting SLA targets.
					</p>
				</div>

				<div className="dashboard-kpi-card">
					<span>At Risk</span>
					<strong>—</strong>
					<p>
						Calls approaching their SLA
						deadline.
					</p>
				</div>

				<div className="dashboard-kpi-card">
					<span>Breached</span>
					<strong>—</strong>
					<p>
						Calls outside agreed SLA targets.
					</p>
				</div>
			</div>

			<div className="dashboard-chart-placeholder">
				<div>
					<h4>SLA Performance</h4>

					<p>
						SLA performance data for{" "}
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

export default SlaDashboardBoard;