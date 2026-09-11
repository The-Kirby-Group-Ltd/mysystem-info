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

	const [customerNos, setCustomerNos] = 
		useState<string[]>(user.customerNos);

	const [customerNoEntry, setCustomerNoEntry] = 
		useState("");
	
	const [siteIds, setSiteIds] = 
		useState<string[]>(user.siteIds);

	const [siteIdEntry, setSiteIdEntry] = 
		useState("");

	const [isSavingAccess, setIsSavingAccess] = 
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

		setCustomerNos(
			user.customerNos ?? []
		);

		setSiteIds(
			user.siteIds ?? []
		);

		setCustomerNoEntry("");
		setSiteIdEntry("");

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
	// Customer No / Site ID Helpers
	// =====================================================

	// add customer no 
	const handleAddCustomerNo = () => {
		const cleanValue =
			customerNoEntry
				.trim()
				.toUpperCase();

		if (!cleanValue) {
			return;
		}

		if (
			customerNos.includes(cleanValue)
		) {
			setError(
				"That customer number is already assigned."
			);
			return;
		}

		setCustomerNos([
			...customerNos,
			cleanValue,
		]);

		setCustomerNoEntry("");
		setError("");
	};

	// remove customer no 
	const handleRemoveCustomerNo = (
		customerNo: string
	) => {
		setCustomerNos(
			customerNos.filter(
				(value) =>
					value !== customerNo
			)
		);
	};

	// add site id
	const handleAddSiteId = () => {
		const cleanValue =
			siteIdEntry
				.trim()
				.toUpperCase();

		if (!cleanValue) {
			return;
		}

		if (
			siteIds.includes(cleanValue)
		) {
			setError(
				"That Site ID is already assigned."
			);
			return;
		}

		setSiteIds([
			...siteIds,
			cleanValue,
		]);

		setSiteIdEntry("");
		setError("");
	};

	// remove site id
	const handleRemoveSiteId = (
		siteId: string
	) => {
		setSiteIds(
			siteIds.filter(
				(value) =>
					value !== siteId
			)
		);
	};

		// =====================================================
		// Update access
		// =====================================================

		const handleSaveAccess = async () => {
		setError("");
		setSuccess("");

		if (!canChangeRole) {
			setError(
				"You do not have permission to change this user's access."
			);
			return;
		}

		if (!selectedRole) {
			setError(
				"Please select a role."
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
			customerNos,
			siteIds,
		};

		try {
			setIsSavingAccess(true);

			await adminApi.updateUser(
				user.userId,
				request
			);

			setSuccess(
				"User access updated successfully."
			);

			onUserUpdated?.();
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to update user access."
			);
		} finally {
			setIsSavingAccess(false);
		}
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="aum-access-tab">
			{/* =================================================
				User role
			================================================= */}

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
								isSavingAccess
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
				</div>

				{!canChangeRole && currentUserIsStaff && (
					<p className="aum-access-note">
						Staff users cannot change Administrator
						or Staff access.
					</p>
				)}
			</section>

			{/* =================================================
				Role information
			================================================= */}

			<details className="aum-info-panel">
				<summary className="aum-info-summary">
					<span>More Information: Roles</span>
					<span
						className="aum-info-chevron"
						aria-hidden="true"
					>
						«
					</span>
				</summary>

				<div className="aum-info-content">
					<div className="user-detail-grid">
						<div className="user-detail-field user-detail-field-wide">
							<span>Administrator</span>

							<strong>
								Administrators have full portal access
								and permissions. They can update any
								user's permissions and access.
							</strong>
						</div>

						<div className="user-detail-field user-detail-field-wide">
							<span>Staff</span>

							<strong>
								Staff users have access to every customer
								and site, and can use Administration to
								manage Engineer, Customer User and Site
								User accounts.
							</strong>
						</div>

						<div className="user-detail-field user-detail-field-wide">
							<span>Engineer</span>

							<strong>
								Engineer users can be restricted to
								specific customers or sites, or configured
								with broader portal access. Engineers do
								not have access to Administration.
							</strong>
						</div>

						<div className="user-detail-field user-detail-field-wide">
							<span>Customer User</span>

							<strong>
								Customer users have access to one or more
								assigned customers and can view the sites,
								systems and calls associated with those
								customer numbers.
							</strong>
						</div>

						<div className="user-detail-field user-detail-field-wide">
							<span>Site User</span>

							<strong>
								Site users are more restricted and can
								only access data relating to one or more
								assigned sites.
							</strong>
						</div>
					</div>
				</div>
			</details>

			{/* =================================================
				Customer access
			================================================= */}

			<section className="user-detail-section">
				<h3>Customer Access</h3>

				<p className="aum-section-description">
					Customer users can access information associated
					with the customer numbers assigned below.
				</p>

				<div className="aum-access-list">
					{customerNos.length === 0 ? (
						<p className="aum-access-empty">
							No customer numbers assigned.
						</p>
					) : (
						customerNos.map((customerNo) => (
							<span
								key={customerNo}
								className="aum-access-chip"
							>
								<span>
									{customerNo}
								</span>

								<button
									type="button"
									disabled={
										!canChangeRole ||
										isSavingAccess
									}
									onClick={() =>
										handleRemoveCustomerNo(
											customerNo
										)
									}
									aria-label={
										`Remove customer ${customerNo}`
									}
									title="Remove customer"
								>
									×
								</button>
							</span>
						))
					)}
				</div>

				<div className="aum-access-entry">
					<input
						type="text"
						placeholder="Customer No"
						value={customerNoEntry}
						disabled={
							!canChangeRole ||
							isSavingAccess
						}
						onChange={(event) =>
							setCustomerNoEntry(
								event.target.value
							)
						}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleAddCustomerNo();
							}
						}}
					/>

					<button
						type="button"
						disabled={
							!canChangeRole ||
							isSavingAccess ||
							!customerNoEntry.trim()
						}
						onClick={handleAddCustomerNo}
					>
						Add
					</button>
				</div>
			</section>

			{/* =================================================
				Site access
			================================================= */}

			<section className="user-detail-section">
				<h3>Site Access</h3>

				<p className="aum-section-description">
					Site users can access information associated
					with the Site IDs assigned below.
				</p>

				<div className="aum-access-list">
					{siteIds.length === 0 ? (
						<p className="aum-access-empty">
							No Site IDs assigned.
						</p>
					) : (
						siteIds.map((siteId) => (
							<span
								key={siteId}
								className="aum-access-chip"
							>
								<span>
									{siteId}
								</span>

								<button
									type="button"
									disabled={
										!canChangeRole ||
										isSavingAccess
									}
									onClick={() =>
										handleRemoveSiteId(
											siteId
										)
									}
									aria-label={
										`Remove site ${siteId}`
									}
									title="Remove site"
								>
									×
								</button>
							</span>
						))
					)}
				</div>

				<div className="aum-access-entry">
					<input
						type="text"
						placeholder="Site ID"
						value={siteIdEntry}
						disabled={
							!canChangeRole ||
							isSavingAccess
						}
						onChange={(event) =>
							setSiteIdEntry(
								event.target.value
							)
						}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleAddSiteId();
							}
						}}
					/>

					<button
						type="button"
						disabled={
							!canChangeRole ||
							isSavingAccess ||
							!siteIdEntry.trim()
						}
						onClick={handleAddSiteId}
					>
						Add
					</button>
				</div>
			</section>

			{/* =================================================
				Save access
			================================================= */}

			<section className="user-detail-section">
				<div className="aum-access-save-row">
					<div>
						<h3>Save Access Changes</h3>

						<p className="aum-section-description">
							This will update the user's assigned role,
							customer access and site access together.
						</p>
					</div>

					<button
						type="button"
						className="aum-update-button"
						disabled={
							!canChangeRole ||
							isSavingAccess ||
							!selectedRole
						}
						onClick={() =>
							void handleSaveAccess()
						}
					>
						{isSavingAccess
							? "Saving..."
							: "Save Access Changes"}
					</button>
				</div>

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
		</div>
	);
};

export default AdminUserAccessTab;