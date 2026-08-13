import type { Call } from "../../data/types/callTypes";
import "../../styles/app-styles/calls/CallsTable.css";

import { useEffect, useState } from "react";

import { referenceApi } from "../../data/api/referenceApi";

import type {
	EngineerReference,
} from "../../data/types/referenceTypes";

import {
	getCallStatusDisplay,
	getCallTypeDisplay,
} from "../../data/types/callMappings";

type CallsTableProps = {
	calls: Call[];
	rowsToShow: number;
	isLoading?: boolean;
	onCallClick: (call: Call) => void;
	engineerNames?: Record<string, string>;
	showSiteId?: boolean;
};

const CallsTable = ({
	calls,
	rowsToShow,
	isLoading = false,
	onCallClick,
	engineerNames = {},
	showSiteId = true,
}: CallsTableProps) => {
	const visibleCalls = calls.slice(0, rowsToShow);
	const skeletonRows = Array.from({
		length: Math.min(rowsToShow, 8),
	});

	const [engineers, setEngineers] =
	useState<EngineerReference[]>([]);

	// ================================
    // format date strings dd/mm/yyyy
    // ================================

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

	// ================================
    // engineer name assignment helper
    // ================================

	const getEngineerName = (engineerCode: string): string => {
		const cleanCode = engineerCode.trim().toUpperCase();

		if (!cleanCode) {
			return "—";
		}

		return engineerNames[cleanCode] ?? engineerCode;
	};

	useEffect(() => {
		let isCancelled = false;

		const loadEngineers = async () => {
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
			} catch {
				// Falling back to engineer code is fine.
				if (!isCancelled) {
					setEngineers([]);
				}
			}
		};

		loadEngineers();

		return () => {
			isCancelled = true;
		};
	}, []);

	const getEngineerDisplay = (
		engineerCode: string
	): string => {
		const cleanCode =
			engineerCode?.trim().toUpperCase() ?? "";

		if (!cleanCode) {
			return "—";
		}

		return (
			engineers.find(
				(engineer) =>
					engineer.code
						.trim()
						.toUpperCase() === cleanCode
			)?.description?.trim() ||
			engineerCode
		);
	};

	// ================================
    // render table
    // ================================

	return (
		<table className="calls-table">
			<thead>
				<tr>
					<th>Call Number</th>
					{showSiteId && <th>Site ID</th>}
					<th>Type</th>
					<th>Status</th>
					<th>Logged</th>
					<th>Engineer</th>
				</tr>
			</thead>

			<tbody>
				{isLoading &&
					skeletonRows.map((_, index) => (
						<tr 
							key={`call-skeleton-${index}`}
							className="calls-skeleton-row"	
						>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
						</tr>
					))}

				{!isLoading &&
					visibleCalls.map((call) => (
						<tr key={call.callNumber}>
							<td>
								<button
									type="button"
									className="call-number-button"
									onClick={() =>
										onCallClick(call)
									}
								>
									{call.callNumber}
								</button>
							</td>

							{showSiteId && <td>{call.siteId}</td>}
							<td>{getCallTypeDisplay(call.callType) || "—"}</td>
							<td>{getCallStatusDisplay(call.callStatus) || "—"}</td>
							<td>{formatDate(call.loggedDate)}</td>
							<td>{getEngineerDisplay(call.engineer)}</td>
						</tr>
					))}

				{!isLoading && visibleCalls.length === 0 && (
					<tr>
						<td
							colSpan={6}
							className="calls-empty-row"
						>
							No calls found.
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default CallsTable;