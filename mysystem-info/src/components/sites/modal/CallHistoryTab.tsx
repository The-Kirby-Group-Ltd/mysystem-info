import { useState, useEffect } from "react";

import CallsTable from "../../calls/CallsTable";
import CallDetailsModal from "../../calls/CallDetailsModal";

import { callsApi } from "../../../data/api/callsApi";

import type { Site } from "../../../data/types/siteTypes";
import type { Call } from "../../../data/types/callTypes";

import { referenceApi } from "../../../data/api/referenceApi";
import type { EngineerReference } from "../../../data/types/referenceTypes";

type CallsHistoryTabProps = {
    site: Site;
}

const CallHistoryTab = ({
    site
}: CallsHistoryTabProps) => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [engineers, setEngineers] = useState<EngineerReference[]>([]);

    // ================================
    // engineer name mapping object
    // ================================

    const engineerNames = Object.fromEntries(
        engineers.map((engineer) => [
            engineer.code.trim().toUpperCase(),
            engineer.description,
        ])
    );

    // ================================
    // load calls for this site
    // ================================

    useEffect(() => {
        let isCancelled = false;

        const loadCallHistory = async () => {
            const siteId = site.siteId.trim().toUpperCase();

            if (!siteId) {
                setError("Site ID could not be retrieved.");
                return;
            }

            setIsLoading(true);
            setError("");

            try {
				const allCalls: Call[] = [];

				let page = 1;
				let hasMore = true;

				// Safety limit prevents an accidental infinite loop
				// if the API returns an incorrect hasMore value.
				const maximumPages = 100;

				while (hasMore && page <= maximumPages) {
					const response = await callsApi.getCalls(
						"",        // customerNo
						siteId,
						0,         // callNumber
						"",        // loggedFrom
						"",        // loggedTo
						"",        // engineer
						"",        // systemType
						page,
						100
					);

					allCalls.push(...response.items);

					hasMore = response.hasMore;
					page++;
				}

				if (isCancelled) {
					return;
				}

				// MMAPI sorts each page separately, so sort the
				// combined result after retrieving every page.
				const sortedCalls = allCalls
                    .filter(
                        (call) =>
                            call.callType.trim().toUpperCase() !== "X" &&
                            call.callType.trim().toUpperCase() !== "CANCELLED"
                    )
                    .sort(
                        (a, b) => b.callNumber - a.callNumber
                    );

                setCalls(sortedCalls);
			} catch (error) {
				if (!isCancelled) {
					setCalls([]);

					setError(
						error instanceof Error
							? error.message
							: "Failed to load call history."
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoading(false);
				}
			}
        };

        loadCallHistory();

        return () => {
            isCancelled = true;
        };
    }, [site.siteId]);

    // ================================
    // load engineer names
    // ================================

    useEffect(() => {
        let isCancelled = false;

        const loadEngineers = async () => {
            try {
                const allEngineers: EngineerReference[] = [];

                let page = 1;
                let hasMore = true;

                while (hasMore) {
                    const response = await referenceApi.getEngineers({
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

    // ================================
    // render tab
    // ================================

    return (
        <>
            {error && (
                <div
                    className="site-modal-error"
                    role="alert"
                >
                    <p>{error}</p>
                </div>
            )}

            <section className="site-detail-section">
                <h3>Call History</h3>

                <p className="site-call-history-summary">
                    Showing {calls.length} calls for{" "}
                    <strong>{site.siteId}</strong>
                </p>

                <div className="site-call-history-table">
                    <CallsTable
                        calls={calls}
                        rowsToShow={calls.length}
                        isLoading={isLoading}
                        onCallClick={setSelectedCall}
                        engineerNames={engineerNames}
                        showSiteId={false}
                    />
                </div>
            </section>

            {selectedCall && (
                <CallDetailsModal 
                    call={selectedCall}
                    onClose={() => setSelectedCall(null)}
                    isNested={true}
                />
            )}
        </>
    )
}

export default CallHistoryTab;