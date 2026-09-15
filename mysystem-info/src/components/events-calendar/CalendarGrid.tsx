type CalendarGridProps = {
	year: number;
	month: number;
};

type CalendarDay = {
	date: Date;
	isCurrentMonth: boolean;
};

const dayHeadings = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun",
];

const CalendarGrid = ({
	year,
	month,
}: CalendarGridProps) => {
	// =====================================================
	// Build calendar days
	// =====================================================

	const buildCalendarDays = (): CalendarDay[] => {
		const firstDay =
			new Date(
				year,
				month,
				1
			);

		/*
		 * JavaScript:
		 * Sunday = 0
		 * Monday = 1
		 *
		 * Convert to:
		 * Monday = 0
		 * Sunday = 6
		 */
		const firstDayIndex =
			(
				firstDay.getDay() +
				6
			) % 7;

		const gridStart =
			new Date(
				year,
				month,
				1 - firstDayIndex
			);

		return Array.from(
			{ length: 42 },
			(_, index) => {
				const date =
					new Date(
						gridStart
					);

				date.setDate(
					gridStart.getDate() +
					index
				);

				return {
					date,

					isCurrentMonth:
						date.getMonth() ===
							month &&
						date.getFullYear() ===
							year,
				};
			}
		);
	};

	const days =
		buildCalendarDays();

	const today =
		new Date();

	const isToday = (
		date: Date
	) => {
		return (
			date.getDate() ===
				today.getDate() &&
			date.getMonth() ===
				today.getMonth() &&
			date.getFullYear() ===
				today.getFullYear()
		);
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="calendar-grid">
			{/* Day headings */}

			{dayHeadings.map(
				(day) => (
					<div
						key={day}
						className="calendar-day-heading"
					>
						{day}
					</div>
				)
			)}

			{/* Calendar cells */}

			{days.map((day) => {
				const dateKey =
					day.date
						.toISOString();

				return (
					<div
						key={dateKey}
						className={
							[
								"calendar-day",

								!day.isCurrentMonth
									? "calendar-day-outside"
									: "",

								isToday(day.date)
									? "calendar-day-today"
									: "",
							]
								.filter(Boolean)
								.join(" ")
						}
					>
						<div className="calendar-day-number">
							{day.date.getDate()}
						</div>

						<div className="calendar-day-events">
							{/* Event nodes will go here */}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default CalendarGrid;