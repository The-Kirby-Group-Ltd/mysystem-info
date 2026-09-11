import { useState } from "react";

import { useAuth } from "../../data/auth/useAuth";
import { adminApi } from "../../data/api/adminApi";

import type {
	AdminUser,
} from "../../data/types/adminTypes";

type AdminUserSecurityTabProps = {
	user: AdminUser;
	onUserUpdated?: () => void;
};

const AdminUserSecurityTab = ({
	user,
	onUserUpdated,
}: AdminUserSecurityTabProps) => {
	const { user: currentUser } = useAuth();

	// =====================================================
	// State
	// =====================================================

	const [newPassword, setNewPassword] =
		useState("");

	const [confirmPassword, setConfirmPassword] =
		useState("");

	const [isUpdatingStatus, setIsUpdatingStatus] =
		useState(false);

	const [isResettingPassword, setIsResettingPassword] =
		useState(false);

	const [error, setError] =
		useState("");

	const [success, setSuccess] =
		useState("");

	// =====================================================
	// Permissions
	// =====================================================

	const currentUserIsAdministrator =
		currentUser?.roles.includes("Administrator") ?? false;

	const currentUserIsStaff =
		currentUser?.roles.includes("Staff") ?? false;

	const targetUserIsPrivileged =
		user.roles.includes("Administrator") ||
		user.roles.includes("Staff");

	const isSelf =
		currentUser?.userId === user.userId;

	const canManageTarget =
		currentUserIsAdministrator ||
		(
			currentUserIsStaff &&
			!targetUserIsPrivileged
		);

	const canChangeStatus =
		canManageTarget &&
		!isSelf;

	const canResetPassword =
		canManageTarget;

	// =====================================================
	// Password validation
	// =====================================================

	const checkSecurePassword = (
		password: string
	): boolean => {
		const hasLower =
			/[a-z]/.test(password);

		const hasUpper =
			/[A-Z]/.test(password);

		const hasNumber =
			/[0-9]/.test(password);

		const hasSpecial =
			/[.,()[\]{}!£$%^&*<>?/]/.test(
				password
			);

		return (
			password.length >= 8 &&
			hasLower &&
			hasUpper &&
			hasNumber &&
			hasSpecial
		);
	};

	// =====================================================
	// Status update
	// =====================================================

	const handleStatusChange = async () => {
		setError("");
		setSuccess("");

		if (!canChangeStatus) {
			setError(
				"You do not have permission to change this user's status."
			);

			return;
		}

		try {
			setIsUpdatingStatus(true);

			await adminApi.updateUserStatus(
				user.userId,
				{
					isActive: !user.isActive,
				}
			);

			setSuccess(
				user.isActive
					? "User deactivated successfully."
					: "User activated successfully."
			);

			onUserUpdated?.();
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to update user status."
			);
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	// =====================================================
	// Password reset
	// =====================================================

	const handlePasswordReset = async () => {
		setError("");
		setSuccess("");

		if (!canResetPassword) {
			setError(
				"You do not have permission to reset this user's password."
			);

			return;
		}

		if (!newPassword) {
			setError(
				"Please enter a new password."
			);

			return;
		}

		if (!checkSecurePassword(newPassword)) {
			setError(
				"The new password does not meet the security requirements."
			);

			return;
		}

		if (newPassword !== confirmPassword) {
			setError(
				"New password and confirmation do not match."
			);

			return;
		}

		try {
			setIsResettingPassword(true);

			await adminApi.resetUserPassword(
				user.userId,
				{
					newPassword,
				}
			);

			setNewPassword("");
			setConfirmPassword("");

			setSuccess(
				"Password reset successfully."
			);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to reset user password."
			);
		} finally {
			setIsResettingPassword(false);
		}
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="aum-security-tab">
			{/* =================================================
			    Account status
			================================================= */}

			<section className="user-detail-section">
				<h3>Account Status</h3>

				<p className="aum-section-description">
					Deactivating a user prevents them from
					accessing the portal without deleting
					their account or assignments.
				</p>

				<div className="aum-security-status-row">
					<div className="user-detail-field">
						<span>Current Status</span>

						<strong>
							{user.isActive
								? "Active"
								: "Deactivated"}
						</strong>
					</div>

					<button
						type="button"
						className={
							user.isActive
								? "aum-status-button aum-status-button-danger"
								: "aum-status-button aum-status-button-success"
						}
						disabled={
							!canChangeStatus ||
							isUpdatingStatus
						}
						onClick={() =>
							void handleStatusChange()
						}
					>
						{isUpdatingStatus
							? "Updating..."
							: user.isActive
								? "Deactivate User"
								: "Activate User"}
					</button>
				</div>

				{isSelf && (
					<p className="aum-access-note">
						You cannot deactivate your own account.
					</p>
				)}

				{!isSelf &&
					!canChangeStatus &&
					currentUserIsStaff && (
						<p className="aum-access-note">
							Staff users cannot change the status
							of Administrator or Staff accounts.
						</p>
					)}
			</section>

			{/* =================================================
			    Password reset
			================================================= */}

			<section className="user-detail-section">
				<h3>Reset Password</h3>

				<p className="aum-section-description">
					Set a new password for this portal user.
					The user will be able to sign in immediately
					using the new password.
				</p>

				<div className="user-detail-grid">
					<div className="user-detail-field">
						<label htmlFor="aum-new-password">
							New Password
						</label>

						<input
							id="aum-new-password"
							type="password"
							autoComplete="new-password"
							value={newPassword}
							disabled={
								!canResetPassword ||
								isResettingPassword
							}
							onChange={(event) =>
								setNewPassword(
									event.target.value
								)
							}
						/>
					</div>

					<div className="user-detail-field">
						<label htmlFor="aum-confirm-password">
							Confirm Password
						</label>

						<input
							id="aum-confirm-password"
							type="password"
							autoComplete="new-password"
							value={confirmPassword}
							disabled={
								!canResetPassword ||
								isResettingPassword
							}
							onChange={(event) =>
								setConfirmPassword(
									event.target.value
								)
							}
						/>
					</div>

					<div className="user-detail-field user-detail-field-wide">
						<p className="aum-password-requirements">
							Password must be at least 8 characters
							long and contain at least one lowercase
							letter, one uppercase letter, one number,
							and one special character.
						</p>
					</div>
				</div>

				<div className="aum-security-actions">
					<button
						type="button"
						className="aum-update-button"
						disabled={
							!canResetPassword ||
							isResettingPassword
						}
						onClick={() =>
							void handlePasswordReset()
						}
					>
						{isResettingPassword
							? "Resetting..."
							: "Reset Password"}
					</button>
				</div>

				{!canResetPassword &&
					currentUserIsStaff && (
						<p className="aum-access-note">
							Staff users cannot reset passwords
							for Administrator or Staff accounts.
						</p>
					)}
			</section>

			{/* =================================================
			    Messages
			================================================= */}

			{error && (
				<p className="aum-error">
					{error}
				</p>
			)}

			{success && (
				<p className="aum-success">
					{success}
				</p>
			)}
		</div>
	);
};

export default AdminUserSecurityTab;