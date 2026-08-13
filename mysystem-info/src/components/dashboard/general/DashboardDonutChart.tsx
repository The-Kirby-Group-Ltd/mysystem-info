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

	onItemClick?: (
		item: DashboardBreakdownItem
	) => void;
};

const colours = [
	"#0072B2",
	"#E69F00",
	"#009E73",
	"#CC79A7",
	"#56B4E9",
	"#D55E00",
	"#F0E442",
	"#666666",
];

const DashboardDonutChart = ({
	title,
	data,
	onItemClick,
}: DashboardDonutChartProps) => {
	const chartData =
		data.filter(
			(item) =>
				item.count > 0
		);

	const total =
		chartData.reduce(
			(sum, item) =>
				sum + item.count,
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
					<div className="dashboard-donut-chart">
						<ResponsiveContainer
							width="100%"
							height={210}
						>
							<PieChart>
								<Pie
									data={
										chartData
									}
									dataKey="count"
									nameKey="label"
									cx="50%"
									cy="50%"
									innerRadius={
										50
									}
									outerRadius={
										75
									}
									paddingAngle={
										2
									}
									cursor={
										onItemClick
											? "pointer"
											: "default"
									}
									onClick={(entry) => {
										if (!onItemClick) {
											return;
										}

										const payload = entry.payload;

										if (
											payload &&
											typeof payload.code === "string" &&
											typeof payload.label === "string" &&
											typeof payload.count === "number"
										) {
											onItemClick({
												code: payload.code,
												label: payload.label,
												count: payload.count,
											});
										}
									}}
								>
									{chartData.map(
										(
											item,
											index
										) => (
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

								<Tooltip />
							</PieChart>
						</ResponsiveContainer>

						<div className="dashboard-donut-centre">
							<strong>
								{total}
							</strong>

							<span>
								Total
							</span>
						</div>
					</div>

					<div className="dashboard-chart-key">
						{chartData.map(
							(
								item,
								index
							) => (
								<button
									type="button"
									className="dashboard-chart-key-item"
									key={
										item.code
									}
									title={
										item.label
									}
									disabled={
										!onItemClick
									}
									onClick={() =>
										onItemClick?.(
											item
										)
									}
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
										{
											item.label
										}
									</span>

									<strong>
										{
											item.count
										}
									</strong>
								</button>
							)
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default DashboardDonutChart;