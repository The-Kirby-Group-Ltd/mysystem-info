import { useEffect, useState } from "react";

import type {
	Call,
	CallAction,
} from "../../../data/types/callTypes";
import type { EngineerReference } from "../../../data/types/referenceTypes";

import { callActionsApi } from "../../../data/api/callActionsApi";
import { referenceApi } from "../../../data/api/referenceApi";

import ActionDataSection from "./ActionDataSection";

type ActionsTabProps = {
	call: Call;
	isLoading?: boolean;
};

const ActionsTab = ({
	call,
	isLoading: isCallLoading = false,
}: ActionsTabProps) => {
	const callNumber = call.callNumber;

	// =====================================================
	// Actions and current selection
	// =====================================================

	const [actionsList, setActionsList] = useState<CallAction[]>([]);

	const [selectedActionNo, setSelectedActionNo] =
		useState<number>(1);

	const selectedAction =
		actionsList.find(
			(action) =>
				action.callActionNumber === selectedActionNo
		) ?? null;

	// =====================================================
	// Engineer reference data
	// =====================================================

	const [engineers, setEngineers] = useState<
		EngineerReference[]
	>([]);

	// =====================================================
	// Loading and error state
	// =====================================================

	const [isLoadingActions, setIsLoadingActions] =
		useState(false);

	const [isLoadingEngineers, setIsLoadingEngineers] =
		useState(false);

	const [actionsError, setActionsError] = useState("");

	const [engineersError, setEngineersError] = useState("");

	// =====================================================
	// Engineer display helper
	// =====================================================

	const getEngineerName = (
		engineerCode: string
	): string => {
		const cleanCode =
			engineerCode?.trim().toUpperCase() ?? "";

		if (!cleanCode) {
			return "—";
		}

		const matchingEngineer = engineers.find(
			(engineer) =>
				engineer.code.trim().toUpperCase() ===
				cleanCode
		);

		return (
			matchingEngineer?.description?.trim() ||
			engineerCode ||
			"—"
		);
	};

	// =====================================================
	// Load all actions for this call
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadActions = async () => {
			if (callNumber <= 0) {
				setActionsError(
					"Call Number could not be retrieved."
				);
				return;
			}

			setIsLoadingActions(true);
			setActionsError("");

			try {
				const allActions: CallAction[] = [];

				let page = 1;
				let hasMore = true;

				// Retrieve all pages so every action can be selected.
				while (hasMore) {
					const result =
						await callActionsApi.getActions(
							callNumber,
							0,
							"",
							page,
							50
						);

					allActions.push(...result.items);
					hasMore = result.hasMore;
					page++;
				}

				if (isCancelled) {
					return;
				}

				// Keep actions in action-number order.
				const sortedActions = allActions.sort(
					(a, b) =>
						a.callActionNumber -
						b.callActionNumber
				);

				setActionsList(sortedActions);

				// Prefer action 1 when it exists.
				const actionOneExists = sortedActions.some(
					(action) =>
						action.callActionNumber === 1
				);

				if (actionOneExists) {
					setSelectedActionNo(1);
				} else if (sortedActions.length > 0) {
					setSelectedActionNo(
						sortedActions[0].callActionNumber
					);
				} else {
					setSelectedActionNo(0);
				}
			} catch (error) {
				if (!isCancelled) {
					setActionsList([]);
					setSelectedActionNo(0);

					setActionsError(
						error instanceof Error
							? error.message
							: "Failed to load call actions."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingActions(false);
				}
			}
		};

		loadActions();

		return () => {
			isCancelled = true;
		};
	}, [callNumber]);

	// =====================================================
	// Load all engineer reference records
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadEngineers = async () => {
			setIsLoadingEngineers(true);
			setEngineersError("");

			try {
				const allEngineers: EngineerReference[] = [];

				let page = 1;
				let hasMore = true;

				while (hasMore) {
					const response =
						await referenceApi.getEngineers({
							page,
							pageSize: 100,
						});

					allEngineers.push(...response.items);
					hasMore = response.hasMore;
					page++;
				}

				if (!isCancelled) {
					setEngineers(allEngineers);
				}
			} catch (error) {
				if (!isCancelled) {
					setEngineers([]);

					setEngineersError(
						error instanceof Error
							? error.message
							: "Failed to load engineer names."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingEngineers(false);
				}
			}
		};

		loadEngineers();

		return () => {
			isCancelled = true;
		};
	}, []);

	// =====================================================
	// Date formatting for the action selector
	// =====================================================

	const formatDate = (
		value: string | null | undefined
	): string => {
		if (!value) {
			return "—";
		}

		const datePart = value.split("T")[0];
		const [year, month, day] = datePart.split("-");

		if (!year || !month || !day) {
			return value;
		}

		return `${day}/${month}/${year}`;
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="call-actions-tab">
			{(isCallLoading ||
				isLoadingActions ||
				isLoadingEngineers) && (
				<p className="call-modal-loading">
					Loading call action details...
				</p>
			)}

			{actionsError && (
				<div
					className="call-modal-error"
					role="alert"
				>
					<p>{actionsError}</p>
				</div>
			)}

			{engineersError && (
				<div
					className="call-modal-error"
					role="alert"
				>
					<p>{engineersError}</p>
					<p>
						Engineer codes are being displayed
						instead.
					</p>
				</div>
			)}

			{!isLoadingActions &&
			actionsList.length === 0 ? (
				<section className="call-detail-section">
					<p className="call-modal-empty">
						No actions were found for this call.
					</p>
				</section>
			) : (
				<div className="call-actions-layout">
					<section className="call-actions-selection">
						<h3>Actions</h3>

						<div className="call-actions-list">
							{actionsList.map((action) => (
								<button
									type="button"
									key={
										action.callActionNumber
									}
									className={
										action.callActionNumber ===
										selectedActionNo
											? "call-action-row call-action-row-active"
											: "call-action-row"
									}
									onClick={() =>
										setSelectedActionNo(
											action.callActionNumber
										)
									}
								>
									<span className="call-action-number">
										Action{" "}
										{
											action.callActionNumber
										}
									</span>

									<span className="call-action-date">
										{formatDate(
											action.appointmentDate ||
												action.startedDate
										)}
									</span>

									<span className="call-action-engineer">
										{getEngineerName(
											action.engineer
										)}
									</span>
								</button>
							))}
						</div>
					</section>

					<section className="call-detail-section call-action-details">
						{selectedAction ? (
							<ActionDataSection
								action={selectedAction}
								engineerName={getEngineerName(
									selectedAction.engineer
								)}
							/>
						) : (
							<p className="call-modal-empty">
								Select an action to view its
								details.
							</p>
						)}
					</section>
				</div>
			)}
		</div>
	);
};

export default ActionsTab;