type DashboardDataSectionProps = {
	title: string;
};

const DashboardDataSection = ({
	title,
}: DashboardDataSectionProps) => {
	return (
		<section className="dashboard-data-section">
			<div className="dashboard-data-heading">
				<div>
					<p className="dashboard-board-eyebrow">
						Details
					</p>

					<h3>{title} Data</h3>
				</div>
			</div>

			<div className="dashboard-data-placeholder">
				<p>
					Detailed supporting records for this
					dashboard will appear here.
				</p>
			</div>
		</section>
	);
};

export default DashboardDataSection;