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

// =========================================================
// SLA eligibility
// =========================================================

export const customerHasSla = (
	customerNo: string
): boolean => {
	const cleanCustomerNo =
		customerNo
			.trim()
			.toUpperCase();

	return SLA_CUSTOMER_NOS.some(
		(value) =>
			value === cleanCustomerNo
	);
};