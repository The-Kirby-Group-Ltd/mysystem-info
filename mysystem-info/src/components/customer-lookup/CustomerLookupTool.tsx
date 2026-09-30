import "../../styles/app-styles/customer-lookup/customer-lookup-tool.css";

import {
	useEffect,
	useState,
} from "react";

import { customerApi } from "../../data/api/customerApi";
import { sitesApi } from "../../data/api/sitesApi";

import type {
	Customer,
} from "../../data/types/customerTypes";

import CustomerLookupTable from "./CustomerLookupTable";

type CustomerLookupToolProps = {
	onCustomerNoSelect: (customerNo: string) => void;
	onClose: () => void;
};

const CustomerLookupTool = ({
	onCustomerNoSelect,
	onClose,
}: CustomerLookupToolProps) => {

	// =================================================
	// Search state
	// =================================================

	const [customerNoSearch, setCustomerNoSearch] =
		useState("");

	const [customerNameSearch, setCustomerNameSearch] =
		useState("");

	const [siteIdSearch, setSiteIdSearch] =
		useState("");

	const [
		customerFieldsDisabled,
		setCustomerFieldsDisabled,
	] = useState(false);

	// =================================================
	// Customer state
	// =================================================

	const [customers, setCustomers] =
		useState<Customer[]>([]);

	const [isLoadingCustomers, setIsLoadingCustomers] =
		useState(false);

	const [error, setError] =
		useState("");

	// =================================================
	// Modal behaviour
	// =================================================

	useEffect(() => {
		const handleExitKeyDown = (
			event: KeyboardEvent
		) => {
			if (event.key === "Escape")
				onClose();
		};

		const previousOverflow =
			document.body.style.overflow;

		document.body.style.overflow =
			"hidden";

		window.addEventListener(
			"keydown",
			handleExitKeyDown
		);

		return () => {
			document.body.style.overflow =
				previousOverflow;

			window.removeEventListener(
				"keydown",
				handleExitKeyDown
			);
		};
	}, [onClose]);

	// =================================================
	// Helpers
	// =================================================

	const handleCustomerNoSelection = (
		customerNoSelection: string
	) => {
		onCustomerNoSelect(
			customerNoSelection
		);

		onClose();
	};

	const handleSiteIdStatus = (
		site: string
	) => {
		setSiteIdSearch(site);

		const hasSiteId =
			Boolean(site.trim());

		setCustomerFieldsDisabled(
			hasSiteId
		);

		if (hasSiteId) {
			setCustomerNoSearch("");
			setCustomerNameSearch("");
		}
	};

	// =================================================
	// Customer search
	// =================================================

	const loadCustomers = async () => {
		setError("");
		setCustomers([]);

		const cleanCustomerNo =
			customerNoSearch
				.trim()
				.toUpperCase();

		const cleanCustomerName =
			customerNameSearch
				.trim();

		const cleanSiteId =
			siteIdSearch
				.trim()
				.toUpperCase();

		try {
			setIsLoadingCustomers(true);

			// =============================================
			// Site ID lookup
			// =============================================

			if (cleanSiteId) {
				const site =
					await sitesApi.getSiteById(
						cleanSiteId
					);

				const customerNo =
					site.customerNo
						?.trim()
						.toUpperCase() ?? "";

				if (!customerNo) {
					setError(
						"The selected site does not have an associated Customer No."
					);

					return;
				}

				const result =
					await customerApi
						.getCustomerByNo(
							customerNo
						);

				setCustomers(
					result.items
				);

				return;
			}

			// =============================================
			// Customer lookup
			// =============================================

			const result =
				await customerApi.getCustomers({
					customerNo:
						cleanCustomerNo,

					customerName:
						cleanCustomerName,

					page: 1,
					pageSize: 50,
				});

			setCustomers(
				result.items
			);

		} catch (error) {
			setCustomers([]);

			setError(
				error instanceof Error
					? error.message
					: "Failed to search customers."
			);
		} finally {
			setIsLoadingCustomers(false);
		}
	};

	// =================================================
	// Form submit
	// =================================================

	const handleSubmit = (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		void loadCustomers();
	};

	// =================================================
	// Render
	// =================================================

	return (
		<div
			className="clt-backdrop"
			onMouseDown={(event) => {
				if (
					event.target ===
					event.currentTarget
				) {
					onClose();
				}
			}}
		>
			<div className="clt-modal">
				{/* ========================================
				    Header
				======================================== */}

				<header className="clt-header">
					<div>
						<p className="clt-header-eyebrow">
							Search Customers
						</p>

						<h2>
							Customer Lookup Tool
						</h2>
					</div>

					<button
						type="button"
						className="clt-close-button"
						onClick={onClose}
						aria-label="Close customer lookup"
					>
						×
					</button>
				</header>

                <div className="clt-body">
                    {/* ========================================
                        Filters
                    ======================================== */}

                    <section className="clt-filters">
                        <form
                            onSubmit={handleSubmit}
                        >
                            <span>
                                Search by Customer Data Fields
                            </span>

                            <div className="clt-customer-filters">
                                <div className="clt-form-field">
                                    <label
                                        htmlFor="clt-customer-no"
                                    >
                                        Customer No
                                    </label>

                                    <input
                                        id="clt-customer-no"
                                        type="text"
                                        className={
                                            customerFieldsDisabled
                                                ? "clt-input-field clt-input-field-disabled"
                                                : "clt-input-field"
                                        }
                                        value={
                                            customerNoSearch
                                        }
                                        disabled={
                                            customerFieldsDisabled
                                        }
                                        onChange={(event) =>
                                            setCustomerNoSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Customer No"
                                    />
                                </div>

                                <div className="clt-form-field">
                                    <label
                                        htmlFor="clt-customer-name"
                                    >
                                        Customer Name
                                    </label>

                                    <input
                                        id="clt-customer-name"
                                        type="text"
                                        className={
                                            customerFieldsDisabled
                                                ? "clt-input-field clt-input-field-disabled"
                                                : "clt-input-field"
                                        }
                                        value={
                                            customerNameSearch
                                        }
                                        disabled={
                                            customerFieldsDisabled
                                        }
                                        onChange={(event) =>
                                            setCustomerNameSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Name Includes"
                                    />
                                </div>
                            </div>

                            <span>
                                Or, if you have a Site ID in mind,
                                use that to search.
                            </span>

                            <div className="clt-form-field">
                                <label
                                    htmlFor="clt-site-id"
                                >
                                    Site ID
                                </label>

                                <input
                                    id="clt-site-id"
                                    type="text"
                                    className="clt-input-field"
                                    value={
                                        siteIdSearch
                                    }
                                    onChange={(event) =>
                                        handleSiteIdStatus(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Site ID"
                                />
                            </div>

                            <button
                                type="submit"
                                className="clt-form-submit"
                                disabled={
                                    isLoadingCustomers
                                }
                            >
                                {isLoadingCustomers
                                    ? "Searching..."
                                    : "Search"}
                            </button>
                        </form>
                    </section>

                    {/* ========================================
                        Error
                    ======================================== */}

                    {error && (
                        <div
                            className="clt-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {/* ========================================
                        Lookup table
                    ======================================== */}

                    <section className="clt-table-section">
                        <div className="clt-table-heading">
                            <div>
                                <p className="clt-table-eyebrow">Results</p>
                                <h3>Customer Search Results</h3>
                            </div>
                        </div>

                        <div className="clt-table-wrapper">
                            <CustomerLookupTable
                                customers={customers}
                                rowsToShow={50}
                                onSelect={(customerNo) =>
                                    handleCustomerNoSelection(
                                        customerNo
                                    )
                                }
                                isLoading={
                                    isLoadingCustomers
                                }
                            />
                        </div>
                    </section>
                
                </div>
			</div>
		</div>
	);
};

export default CustomerLookupTool;