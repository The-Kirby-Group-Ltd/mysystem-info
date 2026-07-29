import { useEffect } from "react";
import type { Call } from "../../data/types/callTypes";
import "../../styles/app-styles/CallModal.css";

type CallDetailsModalProps = {
	call: Call;
	onClose: () => void;
	isNested?: boolean;
};

const CallDetailsModal = ({
	call,
	onClose,
	isNested = false,
}: CallDetailsModalProps) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		const previousOverflow = document.body.style.overflow;

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	return (
		<div
			className={
				isNested
					? "call-modal-backdrop call-modal-backdrop-nested"
					: "call-modal-backdrop"
			}
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<section
				className="call-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="call-modal-title"
			>
				<header className="call-modal-header">
					<div>
						<p>Call Details</p>

						<h2 id="call-modal-title">
							{call.callNumber}
						</h2>
					</div>

					<button
						type="button"
						onClick={onClose}
						aria-label="Close call"
					>
						×
					</button>
				</header>

				<div className="call-modal-content">
					<p>
						<strong>Site:</strong>{" "}
						{call.siteId || "—"}
					</p>

					<p>
						<strong>Status:</strong>{" "}
						{call.callStatus || "—"}
					</p>

					<p>
						<strong>Type:</strong>{" "}
						{call.callType || "—"}
					</p>

					<p>
						<strong>Logged:</strong>{" "}
						{call.loggedDate || "—"}
					</p>

					<p>
						<strong>Engineer:</strong>{" "}
						{call.engineer || "—"}
					</p>
				</div>
			</section>
		</div>
	);
};

export default CallDetailsModal;