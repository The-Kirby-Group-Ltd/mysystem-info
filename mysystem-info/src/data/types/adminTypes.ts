export type AdminUser = {
	userId: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	telephone: string | null;
	isActive: boolean;
	createdAt: string;
	position: string | null;

	roles: string[];
	customerNos: string[];
	siteIds: string[];
};

export type AdminUserFilters = {
	userId: string;
	role: string;
	customerNo: string;
	siteId: string;
	isActive: "" | "true" | "false";
};

export type AdminUserUpdateRequest = {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	telephone: string | null;
	role: string;
	position: string | null;
	customerNos: string[];
	siteIds: string[];
};

export type AdminUserCreateRequest = {
	username: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	telephone: string | null;
	role: string;
	position: string | null;
	customerNos: string[];
	siteIds: string[];
};

export type AdminPasswordResetRequest = {
	newPassword: string;
};

export type AdminUserStatusRequest = {
	isActive: boolean;
};

export type AdminRole = {
	roleId: number;
	roleName: string;
};