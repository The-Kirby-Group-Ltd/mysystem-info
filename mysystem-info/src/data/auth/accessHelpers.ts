import type { AuthUser } from "./authTypes";
import sitesApi from "../api/sitesApi";

// =======================================================
// User access level check
// =======================================================

export const hasUnrestrictedAccess = (
	user: AuthUser
): boolean => {
	return (
		user.roles.includes("Administrator") ||
		user.roles.includes("Staff") ||
		user.roles.includes("Engineer")
	);
};

// =======================================================
// Get user CustomerNos / SiteIds
// =======================================================

export const getUserCustomerNos = (
	user: AuthUser
): string[] => {
	if (!user.roles.includes("CustomerUser")) {
		return [];
	}

	return [
		...new Set(
			user.customerNos
				.map((customerNo) =>
					customerNo.trim().toUpperCase()
				)
				.filter(Boolean)
		),
	];
};

export const getUserSiteIds = (
	user: AuthUser
): string[] => {
	if (!user.roles.includes("SiteUser")) {
		return [];
	}

	return [
		...new Set(
			user.siteIds
				.map((siteId) =>
					siteId.trim().toUpperCase()
				)
				.filter(Boolean)
		),
	];
};

// =======================================================
// Can access customer
// =======================================================

export const canAccessCustomer = (
	user: AuthUser,
	requestCustomerNo: string
): boolean => {
	if (hasUnrestrictedAccess(user)) {
		return true;
	}

	const cleanRequestCustomerNo =
		requestCustomerNo.trim().toUpperCase();

	if (!cleanRequestCustomerNo) {
		return false;
	}

	const customerNos =
		getUserCustomerNos(user);

	return customerNos.includes(
		cleanRequestCustomerNo
	);
};

// =======================================================
// Can access site
// =======================================================

export const canAccessSite = async (
	user: AuthUser,
	requestSiteId: string
): Promise<boolean> => {
	if (hasUnrestrictedAccess(user)) {
		return true;
	}

	const cleanRequestSiteId =
		requestSiteId.trim().toUpperCase();

	if (!cleanRequestSiteId) {
		return false;
	}

	// ===================================================
	// Site User
	// ===================================================

	if (user.roles.includes("SiteUser")) {
		const siteIds =
			getUserSiteIds(user);

		return siteIds.includes(
			cleanRequestSiteId
		);
	}

	// ===================================================
	// Customer User
	// ===================================================

	if (user.roles.includes("CustomerUser")) {
		const customerNos =
			getUserCustomerNos(user);

		if (customerNos.length === 0) {
			return false;
		}

		try {
			const site =
				await sitesApi.getSiteById(
					cleanRequestSiteId
				);

			if (!site) {
				return false;
			}

			const siteCustomerNo =
				site.customerNo
					?.trim()
					.toUpperCase() ?? "";

			return customerNos.includes(
				siteCustomerNo
			);
		} catch {
			return false;
		}
	}

	return false;
};