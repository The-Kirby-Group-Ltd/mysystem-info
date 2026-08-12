import {
	Cell,
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

// =====================================================
// Accessible chart palette
//
// Uses strongly differentiated hues rather than shades
// of the same colour.
// =====================================================

const colours = [
	"#0072B2", // blue
	"#E69F00", // orange
	"#009E73", // green
	"#CC79A7", // purple / pink
	"#56B4E9", // light blue
	"#D55E00", // vermillion
	"#F0E442", // yellow
	"#666666", // grey
];

// =====================================================
// Donut chart
// =====================================================

const DashboardDonutChart = ({
	title,
	data,
}: DashboardDonutChartProps) => {
	// Don't include empty categories in the chart/key.
	const chartData = data.filter(
		(item) => item.count > 0
	);

	// Total is useful for the centre of the donut.
	const total = chartData.reduce(
		(sum, item) => sum + item.count,
		0
	);

	return (
		<div className="dashboard-chart-card">
			<h4>{title}</h4>

			{chartData.length === 0 ? (
				<p className="dashboard-chart-empty">
					No data available.
				</p>
			) : (
				<>
					{/* =============================
					    Donut
					============================= */}

					<div className="dashboard-donut-chart">
						<ResponsiveContainer
							width="100%"
							height={210}
						>
							<PieChart>
								<Pie
									data={chartData}
									dataKey="count"
									nameKey="label"
									cx="50%"
									cy="50%"
									innerRadius={50}
									outerRadius={75}
									paddingAngle={2}
								>
									{chartData.map(
										(item, index) => (
											<Cell
												key={
													item.code
												}
												fill={
													colours[
														index %
															colours.length
													]
												}
											/>
										)
									)}
								</Pie>

								<Tooltip
									formatter={(
										value,
										name
									) => [
										value,
										name,
									]}
								/>
							</PieChart>
						</ResponsiveContainer>

						{/* =============================
						    Centre value
						============================= */}

						<div className="dashboard-donut-centre">
							<strong>{total}</strong>
							<span>{" "}Total</span>
						</div>
					</div>

					{/* =============================
					    Custom chart key
					============================= */}

					<div className="dashboard-chart-key">
						{chartData.map(
							(item, index) => (
								<div
									className="dashboard-chart-key-item"
									key={item.code}
									title={item.label}
								>
									<span
										className="dashboard-chart-key-colour"
										style={{
											backgroundColor:
												colours[
													index %
														colours.length
												],
										}}
									/>

									<span className="dashboard-chart-key-label">
										{item.label}
									</span>

									<strong>
										{item.count}
									</strong>
								</div>
							)
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default DashboardDonutChart;