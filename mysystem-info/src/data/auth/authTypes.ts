export type UserRole =
	| "Administrator"
	| "Staff"
	| "Engineer"
	| "CustomerUser"
	| "SiteUser";

export type AuthUser = {
	userId: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	roles: UserRole[];
	customerNos: string[];
	siteIds: string[];
};

export type LoginRequest = {
	username: string;
	password: string;
};

export type LoginResponse = {
	token: string;
	user: AuthUser;
};

export type AuthState = {
	user: AuthUser | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
};

export type ChangePasswordRequest = {
	oldPassword: string;
	newPassword: string;
	verificationCode: string;
};

export type ForgotPasswordNewRequest = {
	email: string;
	newPassword: string;
	verificationCode: string;
}