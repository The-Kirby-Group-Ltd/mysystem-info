import "../../styles/app-styles/customer-lookup/customer-lookup-tool.css";
import { useState, useEffect } from "react";

type CustomerLookupToolProps = {
    onCustomerNoSelect: (customerNo: string) => void;
    onClose: () => void;
}

const CustomerLookupTool = ({
    onCustomerNoSelect, onClose
}: CustomerLookupToolProps) => {

    // =================================================
    // Search state
    // =================================================

    const [customerNoSearch, setCustomerNoSearch] = useState("");
    const [customerNameSearch, setCustomerNameSearch] = useState("");

    const [siteIdSearch, setSiteIdSearch] = useState("");
    const [customerFieldsDisabled, setCustomerFieldsDisabled] = useState(false);    

    // =================================================
    // Modal behaviour
    // =================================================

    useEffect(() => {
        const handleSearchKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") 
                loadCustomers();
        };

        const handleExitKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") 
                onClose();
        };

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        window.addEventListener("keydown", handleSearchKeyDown);
        window.addEventListener("keydown", handleExitKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleExitKeyDown);
            window.removeEventListener("keydown", handleSearchKeyDown);
        };
    }, [onClose]);
    
    // =================================================
    // Helpers
    // =================================================

    const handleCustomerNoSelection = (
        customerNoSelection: string
    ) => {
        onCustomerNoSelect(customerNoSelection);
        onClose();
    }

    const handleSiteIdStatus = (site: string) => {  
        setSiteIdSearch(site);
        
        if (site.trim()) {
            setCustomerFieldsDisabled(true);
            return;
        }

        setCustomerFieldsDisabled(false);
    }

    // =================================================
    // Customers API
    // =================================================

    const loadCustomers = () => {
        console.log("loadCustomers() was called.")
        return [];
    }

    // =================================================
    // Render
    // =================================================

    return (
        <div className="clt-backdrop">
            <div className="clt-modal">
                {/* =========   Header   ========= */}

                <header className="clt-header">
                    <div>
                        <p className="clt-header-eyebrow">
                            Search Customers
                        </p>

                        <h2>Customer Lookup Tool</h2>
                    </div>

                    <button
                        type="button"
                        className="clt-close-button"
                        onClick={() => onClose()}
                    >
                        ×
                    </button>
                </header>

                {/* =========   Filters   ========= */}

                <section className="clt-filters">
                    <form>
                        <span>Search by Customer Data Fields</span>

                        <div className="clt-customer-filters">

                            <div className="clt-form-field">
                                <label>Customer No</label>
                                <input 
                                    type="text" 
                                    className={
                                        customerFieldsDisabled
                                            ? "clt-input-field clt-input-field-disabled"
                                            : "clt-input-field"
                                    }
                                    value={customerNoSearch}
                                    disabled={customerFieldsDisabled}
                                    onChange={(e) => setCustomerNoSearch(e.target.value)}
                                    placeholder="Customer No"
                                />
                            </div>

                            <div className="clt-form-field">
                                <label>Customer Name</label>
                                <input 
                                    type="text" 
                                    className={
                                        customerFieldsDisabled
                                            ? "clt-input-field clt-input-field-disabled"
                                            : "clt-input-field"
                                    }
                                    value={customerNameSearch}
                                    disabled={customerFieldsDisabled}
                                    onChange={(e) => setCustomerNameSearch(e.target.value)}
                                    placeholder="Name Includes"
                                />
                            </div>
                        </div>

                        <span>Or, if you have a Site ID in mind, use that to search.</span>

                        <div className="clt-form-field">
                            <label>Site ID</label>
                            <input 
                                type="text" 
                                className={"clt-input-field"}
                                value={siteIdSearch}
                                onChange={(e) => handleSiteIdStatus(e.target.value)}
                                placeholder="Site ID"
                            />
                        </div>
                    </form>

                    <button
                        type="submit" 
                        className="clt-form-submit"
                        onClick={() => loadCustomers()}
                    >
                        Search
                    </button>
                </section>

                {/* =========   Lookup Table   ========= */}
                
                <section className="clt-table">
                    {/* table component here */}
                </section>
            </div>
        </div>
    )
}

export default CustomerLookupTool;