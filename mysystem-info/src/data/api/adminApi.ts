import { httpClient } from "./httpClient";

import type {
    AdminPasswordResetRequest,
    AdminRole,
    AdminUser,
    AdminUserCreateRequest,
    AdminUserFilters,
    AdminUserStatusRequest,
    AdminUserUpdateRequest,
} from "../types/adminTypes";

export const adminApi = {
	// =====================================================
	// Users
	// =====================================================

    getUsers: (filters: AdminUserFilters) => {
        const params = new URLSearchParams();

        if (filters.userId.trim()) {
            params.set("userId", filters.userId.trim());
        }

        if (filters.role.trim()) {
            params.set("role", filters.role.trim());
        }

        if (filters.customerNo.trim()) {
            params.set("customerNo", filters.customerNo.trim());
        }

        if (filters.siteId.trim()) {
            params.set("siteId", filters.siteId.trim());
        }

        const query = params.toString();
        return httpClient<AdminUser[]>(
            `/api/admin/users${query ? `?${query}` : ""}`
        );
    },

    getUserById: (userId: string) => 
        httpClient<AdminUser>(
            `/api/admin/users/${encodeURIComponent(userId)}`
        ),

	createUser: (
		request: AdminUserCreateRequest
	) =>
		httpClient<AdminUser>(
			"/api/admin/users",
			{
				method: "POST",
				body: JSON.stringify(request),
			}
		),

	updateUser: (
		userId: string,
		request: AdminUserUpdateRequest
	) =>
		httpClient<AdminUser>(
			`/api/admin/users/${encodeURIComponent(userId)}`,
			{
				method: "PATCH",
				body: JSON.stringify(request),
			}
		),

	updateUserStatus: (
		userId: string,
		request: AdminUserStatusRequest
	) =>
		httpClient<{
			userId: string;
			isActive: boolean;
		}>(
			`/api/admin/users/${encodeURIComponent(userId)}/status`,
			{
				method: "PATCH",
				body: JSON.stringify(request),
			}
		),

	resetUserPassword: (
		userId: string,
		request: AdminPasswordResetRequest
	) =>
		httpClient<{
			userId: string;
			passwordUpdated: boolean;
		}>(
			`/api/admin/users/${encodeURIComponent(userId)}/reset-password`,
			{
				method: "POST",
				body: JSON.stringify(request),
			}
		),

	// =====================================================
	// Roles
	// =====================================================

	getRoles: () =>
		httpClient<AdminRole[]>(
			"/api/admin/roles"
		),
}