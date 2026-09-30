import type {
    Customer,
} from "../../data/types/customerTypes";

type CustomerLookupTableProps = {
    customers: Customer[];
    rowsToShow: number;
    onSelect: (customerNo: string) => void;
    isLoading?: boolean;
}

const CustomerLookupTable = ({
    customers,
    rowsToShow,
    onSelect,
    isLoading = false,
}: CustomerLookupTableProps) => {
    const visibleCustomers = customers.slice(0, rowsToShow);
    const skeletonRows = Array.from({
        length: Math.min(
            rowsToShow,
            rowsToShow
        )
    });

    return (
        <table className="customers-table">

            {/* ============================
            ====          HEAD          ====
            ============================ */}

            <thead>
                <tr>
                    <th>Customer No</th>
                    <th>Customer Name</th>
                    <th>Registered Postcode</th>
                </tr>
            </thead>

            {/* ============================
            ====          BODY          ====
            ============================ */}

            <tbody>

                {/* =============================
                    ====    SKELETON ROWS    ====
                    ============================= */}

                {isLoading && 
                    skeletonRows.map((_, index) => (
                        <tr 
                            key={`skeleton-${index}`} 
                            className="sites-skeleton-row"
                        >
                            <td>
                                <span className="skeleton-block skeleton-short" />
                            </td>
                            <td>
                                <span className="skeleton-block skeleton-long" />
                            </td>
                            <td>
                                <span className="skeleton-block skeleton-short" />
                            </td>
                        </tr>
                    ))
                }

                {/* =============================
                    ====      DATA ROWS      ====
                    ============================= */}

                {!isLoading && 
                    visibleCustomers.map((customer) => (
                        <tr 
                            key={customer.customerNo}
                            className="customers-table-row"
                        >
                            <td>
                                <button
                                    type="button"
                                    className="customerno-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelect(customer.customerNo);
                                    }}
                                >
                                    {customer.customerNo}
                                </button>
                            </td>

                            <td>{customer.customerName}</td>
                            <td>{customer.postCode}</td>
                        </tr>
                    ))
                }

                {/* =============================
                    ====        ERROR        ====
                    ============================= */}

                {!isLoading && visibleCustomers.length === 0 && (
                    <tr>
                        <td 
                            colSpan={3} 
                            className="customers-empty-row"
                        >
                            No accessible customers could be found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default CustomerLookupTable;