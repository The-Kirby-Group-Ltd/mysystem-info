import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

import type {
	DashboardBreakdownItem,
} from "../../../data/types/dashboardTypes";

type DashboardDonutChartProps = {
	title: string;
	data: DashboardBreakdownItem[];
};

const colours = [
	"#db2d2d",
	"#a51f1f",
	"#d66a6a",
	"#7a78c2",
	"#d49a32",
	"#3d9461",
	"#4f86c6",
	"#888888",
];

const DashboardDonutChart = ({
	title,
	data,
}: DashboardDonutChartProps) => {
	return (
		<div className="dashboard-chart-card">
			<h4>{title}</h4>

			{data.length === 0 ? (
				<p className="dashboard-chart-empty">
					No data available.
				</p>
			) : (
				<div className="dashboard-donut-chart">
					<ResponsiveContainer
						width="100%"
						height={260}
					>
						<PieChart>
							<Pie
								data={data}
								dataKey="count"
								nameKey="label"
								cx="50%"
								cy="48%"
								innerRadius={58}
								outerRadius={90}
								paddingAngle={2}
							>
								{data.map((item, index) => (
									<Cell
										key={item.code}
										fill={
											colours[
												index %
													colours.length
											]
										}
									/>
								))}
							</Pie>

							<Tooltip />

							<Legend
								verticalAlign="bottom"
								height={42}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
};

export default DashboardDonutChart;