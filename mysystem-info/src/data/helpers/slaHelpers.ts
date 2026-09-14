// =========================================================
// SLA customers
// =========================================================

const SLA_CUSTOMER_NOS = [
    "SEL000",
    "SEL002",

    "GAT005",
	"GAT006",
	"GAT008",
	"GAT010",
	"FER002",
] as const;

export type SlaCustomerNo = typeof SLA_CUSTOMER_NOS[number];

// =========================================================
// SLA eligibility
// =========================================================

export const customerHasSla = (
	customerNo: string
): boolean => {
	const cleanCustomerNo = customerNo
        .trim()
        .toUpperCase();

	return SLA_CUSTOMER_NOS.includes(
		cleanCustomerNo as SlaCustomerNo
	);
};

// =========================================================
// Call SLA helpers
// =========================================================

export const callFailedToRespond = (
	failedToRespond_YN?: string | null
): boolean => {
	return (
		failedToRespond_YN
			?.trim()
			.toUpperCase() === "Y"
	);
};

export const cleanFailureReasonCode = (
	code?: string | null
): string => {
	return (
		code
			?.trim()
			.toUpperCase() ?? ""
	);
};