import { httpClient } from "./httpClient";
import type { 
	AuthUser,
	LoginRequest,
	LoginResponse,
	ChangePasswordRequest,
	ForgotPasswordNewRequest,
} from "../auth/authTypes";

export const authApi = {

	// ===================================================
	// User auth/data api 
	// ===================================================

	login: (request: LoginRequest) =>
		httpClient<LoginResponse>("/api/auth/login", {
			method: "POST",
			body: JSON.stringify(request),
		}),

	me: () => httpClient<AuthUser>("/api/auth/me"),

	// ===================================================
	// Password reset api 
	// ===================================================

	requestPasswordChangeCode: () => 
		httpClient<{ message: string }>(
			"/api/change-password/code",
			{
				method: "POST",
			}
		),

	changePassword: (
		request: ChangePasswordRequest
	) => 
		httpClient<{ message: string }>(
			"/api/change-password",
			{
				method: "POST",
				body: JSON.stringify(request)
			}
		),

	// ===================================================
	// Password reset | no auth
	// ===================================================

	requestForgotPasswordAuthCode: (
		email: string
	) => {
		const cleanEmail = 
			email.trim().toLowerCase();

		return httpClient<{ message: string }>(
			"api/forgot-password/code",
			{
				method: "POST",
				body: JSON.stringify(cleanEmail)
			}
		)
	},

	requestForgotPasswordNew: (
		request: ForgotPasswordNewRequest
	) => {
		return httpClient<{ message: string }>(
			"api/forgot-password/password",
			{
				method: "POST",
				body: JSON.stringify(request)
			}
		)
	},
	
};