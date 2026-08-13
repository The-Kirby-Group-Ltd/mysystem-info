import type {
	ReactNode,
} from "react";

import "../../../styles/app-styles/dashboard/DashboardSupportTable.css";

type DashboardDataSectionProps = {
	title: string;
	children?: ReactNode;
};

const DashboardDataSection = ({
	title,
	children,
}: DashboardDataSectionProps) => {
	return (
		<section className="dashboard-data-section">
			<div className="dashboard-data-heading">
				<div>
					<p className="dashboard-board-eyebrow">
						Details
					</p>

					<h3>
						{title} Data
					</h3>
				</div>
			</div>

			{children ?? (
				<div className="dashboard-data-placeholder">
					<p>
						Detailed supporting records
						will appear here.
					</p>
				</div>
			)}
		</section>
	);
};

export default DashboardDataSection;