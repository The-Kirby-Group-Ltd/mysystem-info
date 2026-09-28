import { useState, useEffect } from "react";

type CustomerLookupToolProps = {
    customerNo: string;
    onCustomerNoSelect: (customerNo: string) => void;
    onClose: () => void;
}

const CustomerLookupTool = ({
    customerNo, onCustomerNoSelect, onClose
}: CustomerLookupToolProps) => {

    // =================================================
    // Search state
    // =================================================

    const [customerNoSearch, setCustomerNoSearch] = useState("");
    const [customerNameSearch, setCustomerNameSearch] = useState("");

    // =================================================
    // Modal behaviour
    // =================================================

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
    
    // =================================================
    // Customer number selection
    // =================================================

    const handleCustomerNoSelection = (
        customerNoSelection: string
    ) => {
        onCustomerNoSelect(customerNoSelection);
        onClose();
    }

    // =================================================
    // Customers API
    // =================================================

    const loadCustomers = () => {
        return [];
    }

    // =================================================
    // Render
    // =================================================

    return (
        <div className="clt-backdrop">
            <div className="clt-modal">
                {/* ================================ 
                ============   Header   ============
                ================================ */}

                <header className="clt-header">
                    <h3>Customer Lookup Tool</h3>

                    <button
                        type="button"
                        className="clt-close-button"
                        onClick={() => onClose()}
                    >
                        X
                    </button>
                </header>

                {/* ================================ 
                ============   Filters   ===========
                ================================ */}

                <section className="clt-filters">
                    <form>
                        <input 
                            type="text" 
                            className="clt-form-field"
                            value={customerNoSearch}
                            onChange={(e) => setCustomerNoSearch(e.target.value)}
                            placeholder="Customer No"
                        />

                        <input 
                            type="text" 
                            className="clt-form-field"
                            value={customerNameSearch}
                            onChange={(e) => setCustomerNoSearch(e.target.value)}
                            placeholder="Name Includes"
                        />
                    </form>

                    <button
                        type="submit" 
                        className="clt-form-submit"
                        onClick={() => loadCustomers()}
                    >
                        Search
                    </button>
                </section>

                {/* ================================ 
                =========   Lookup Table   =========
                ================================ */}
                
                <section className="clt-table">
                    {/* table component here */}
                </section>

                {/* ================================ 
                ============   Footer   ============
                ================================ */}

                <section className="clt-footer">
                    <button
                        onClick={() => onClose()}
                    >
                        Close
                    </button>
                </section>
            </div>
        </div>
    )
}

export default CustomerLookupTool;