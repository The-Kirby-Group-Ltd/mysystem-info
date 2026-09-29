type CustomerLookupTableProps = {
    customers: Customer[];
    onSelect: () => void;
}

const CustomerLookupTable = ({
    customers,
    onSelect,
}) => {
    return <h1>Customer Table</h1>
}

export default CustomerLookupTable;