import type { CallAction } from "../../../data/types/callTypes";

type ActionDataSectionProps = {
	action: CallAction;
	engineerName: String;
};

const ActionDataSection = ({
	action,
	engineerName,
}: ActionDataSectionProps) => {
	// =====================================================
	// Format a separate date and time into DD/MM/YYYY @ HH:mm
	// =====================================================

	const formatDateTime = (
		date: string | null | undefined,
		time: string | null | undefined
	): string => {
		if (!date) {
			return "—";
		}

		const datePart = date.split("T")[0];
		const [year, month, day] = datePart.split("-");

		if (!year || !month || !day) {
			return date;
		}

		const formattedDate = `${day}/${month}/${year}`;

		if (!time) {
			return formattedDate;
		}

		const [hour, minute] = time.split(":");

		if (!hour || !minute) {
			return formattedDate;
		}

		return `${formattedDate} @ ${hour}:${minute}`;
	};

	const appointmentDate = formatDateTime(
		action.appointmentDate,
		action.appointmentFromTime
	);

	const startedDate = formatDateTime(
		action.startedDate,
		action.startedTime
	);

	const finishedDate = formatDateTime(
		action.finishedDate,
		action.finishedTime
	);

	// =====================================================
	// Format total time on site
	// =====================================================

	const formatTimeOnSite = (): string => {
		const hours = action.hoursOnSite ?? 0;
		const minutes = action.minutesOnSite ?? 0;

		if (hours <= 0 && minutes <= 0) {
			return "—";
		}

		const parts: string[] = [];

		if (hours > 0) {
			parts.push(
				`${hours} ${hours === 1 ? "hour" : "hours"}`
			);
		}

		if (minutes > 0) {
			parts.push(
				`${minutes} ${
					minutes === 1 ? "minute" : "minutes"
				}`
			);
		}

		return parts.join(" ");
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="action-data-section">
			<h3>
				Action {action.callActionNumber}
			</h3>

			<div className="call-detail-grid">
				<div className="call-detail-field">
					<span>Appointment</span>
					<strong>{appointmentDate}</strong>
				</div>

				<div className="call-detail-field">
					<span>Engineer</span>
					<strong>{engineerName || "—"}</strong>
				</div>

				<div className="call-detail-field">
					<span>Started</span>
					<strong>{startedDate}</strong>
				</div>

				<div className="call-detail-field">
					<span>Finished</span>
					<strong>{finishedDate}</strong>
				</div>

				<div className="call-detail-field">
					<span>Time on Site</span>
					<strong>{formatTimeOnSite()}</strong>
				</div>

				<div className="call-detail-field">
					<span>Customer Signatory</span>
					<strong>
						{action.signatureName || "—"}
					</strong>
				</div>

				<div className="call-detail-field">
					<span>Engineer Signatory</span>
					<strong>
						{action.onCallEngineersName || "—"}
					</strong>
				</div>

				<div className="call-detail-field">
					<span>Status</span>
					<strong>
						{action.callStatus || "—"}
					</strong>
				</div>
			</div>

			<div className="call-action-remarks">
				<div className="call-action-remarks-block">
					<span className="call-action-remarks-label">
						Office Remarks
					</span>

					<p className="call-modal-remarks">
						{action.remarks ||
							"No office remarks were provided."}
					</p>
				</div>

				<div className="call-action-remarks-block">
					<span className="call-action-remarks-label">
						Action Taken
					</span>

					<p className="call-modal-remarks">
						{action.actionTaken ||
							"No engineer remarks were provided."}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ActionDataSection;