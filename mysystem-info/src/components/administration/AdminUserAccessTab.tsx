import {
	useEffect,
	useState,
} from "react";

import { useAuth } from "../../data/auth/useAuth";
import { adminApi } from "../../data/api/adminApi";

import type {
	AdminRole,
	AdminUser,
	AdminUserUpdateRequest,
} from "../../data/types/adminTypes";

type AdminUserAccessTabProps = {
	user: AdminUser;
	onUserUpdated?: () => void;
};

const AdminUserAccessTab = ({
	user,
	onUserUpdated,
}: AdminUserAccessTabProps) => {
	const { user: currentUser } = useAuth();

	// =====================================================
	// State
	// =====================================================

	const [roles, setRoles] =
		useState<AdminRole[]>([]);

	const [selectedRole, setSelectedRole] =
		useState(
			user.roles?.[0] ?? ""
		);

	const [isLoadingRoles, setIsLoadingRoles] =
		useState(false);

	const [isSavingRole, setIsSavingRole] =
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

	const canChangeRole =
		currentUserIsAdministrator ||
		(
			currentUserIsStaff &&
			!targetUserIsPrivileged
		);

	// =====================================================
	// Load roles
	// =====================================================

	useEffect(() => {
		const loadRoles = async () => {
			setError("");

			try {
				setIsLoadingRoles(true);

				const result =
					await adminApi.getRoles();

				setRoles(result);
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: "Failed to load roles."
				);
			} finally {
				setIsLoadingRoles(false);
			}
		};

		void loadRoles();
	}, []);

	// =====================================================
	// Reset selected role when user changes
	// =====================================================

	useEffect(() => {
		setSelectedRole(
			user.roles?.[0] ?? ""
		);

		setError("");
		setSuccess("");
	}, [user]);

	// =====================================================
	// Allowed roles
	// =====================================================

	const availableRoles =
		currentUserIsAdministrator
			? roles
			: roles.filter((role) =>
				[
					"Engineer",
					"CustomerUser",
					"SiteUser",
				].includes(role.roleName)
			);

	// =====================================================
	// Update role
	// =====================================================

	const handleUpdateRole = async () => {
		setError("");
		setSuccess("");

		if (!canChangeRole) {
			setError(
				"You do not have permission to change this user's role."
			);
			return;
		}

		if (!selectedRole) {
			setError(
				"Please select a role."
			);
			return;
		}

		if (selectedRole === user.roles?.[0]) {
			setError(
				"The selected role is already assigned to this user."
			);
			return;
		}

		const request: AdminUserUpdateRequest = {
			username: user.username,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			telephone: user.telephone,
			position: user.position,

			role: selectedRole,

			customerNos: user.customerNos,
			siteIds: user.siteIds,
		};

		try {
			setIsSavingRole(true);

			await adminApi.updateUser(
				user.userId,
				request
			);

			setSuccess(
				"User role updated successfully."
			);

			onUserUpdated?.();
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to update user role."
			);
		} finally {
			setIsSavingRole(false);
		}
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="aum-access-tab">
			<section className="user-detail-section">
				<h3>User Role</h3>

				<div className="aum-role-grid">
					<div className="user-detail-field">
						<span>Current Role</span>

						<strong>
							{user.roles.length > 0
								? user.roles.join(", ")
								: "No roles found."}
						</strong>
					</div>

					<div className="user-detail-field">
						<label htmlFor="aum-user-role">
							Assigned Role
						</label>

						<select
							id="aum-user-role"
							value={selectedRole}
							disabled={
								!canChangeRole ||
								isLoadingRoles ||
								isSavingRole
							}
							onChange={(event) =>
								setSelectedRole(
									event.target.value
								)
							}
						>
							<option value="">
								Select role
							</option>

							{availableRoles.map((role) => (
								<option
									key={role.roleId}
									value={role.roleName}
								>
									{role.roleName}
								</option>
							))}
						</select>
					</div>

					<div className="aum-role-action">
						<button
							type="button"
							className="aum-update-button"
							disabled={
								!canChangeRole ||
								isLoadingRoles ||
								isSavingRole ||
								!selectedRole
							}
							onClick={() =>
								void handleUpdateRole()
							}
						>
							{isSavingRole
								? "Updating..."
								: "Update Role"}
						</button>
					</div>
				</div>

				{!canChangeRole && currentUserIsStaff && (
					<p className="aum-access-note">
						Staff users cannot change Administrator
						or Staff roles.
					</p>
				)}

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
			</section>

            <section className="user-detail-section">
                <h3>Further Information:</h3>

                <div className="user-detail-grid"> 
                    <div 
                        className="
                            user-detail-field
                            user-detail-field-wide"
                    >
                        <span>Administrator</span>
                        <strong>
                            Administrators have full portal 
                            access and permissions. They can 
                            update any user's permissions in 
                            any way. 
                        </strong>
                    </div>

                    <div 
                        className="
                            user-detail-field
                            user-detail-field-wide"
                    >
                        <span>Staff</span>
                        <strong>
                            Staff users have access to every
                            customer and site, and can access 
                            the administration screen to update 
                            engineers, customer and site users. 
                        </strong>
                    </div>

                    <div 
                        className="
                            user-detail-field
                            user-detail-field-wide"
                    >
                        <span>Engineer</span>
                        <strong>
                            Engineer users are versatile, as they 
                            can be restricted to specific customers
                            or sites, or given full access. Engineers 
                            do not have access to the Administration 
                            tab.
                        </strong>
                    </div>

                    <div 
                        className="
                            user-detail-field
                            user-detail-field-wide"
                    >
                        <span>Customer</span>
                        <strong>
                            Customer users have access to one or 
                            more specific customer's information. 
                            They can see all sites, systems and 
                            calls underneath the umbrella of their 
                            associated customer numbers/IDs. 
                        </strong>
                    </div>

                    <div 
                        className="
                            user-detail-field
                            user-detail-field-wide"
                    >
                        <span>Customer</span>
                        <strong>
                            Like customer users, however more 
                            restricted. Site users only have access 
                            to data regarding one or more assigned 
                            sites.
                        </strong>
                    </div>
                </div>
            </section>
		</div>
	);
};

export default AdminUserAccessTab;