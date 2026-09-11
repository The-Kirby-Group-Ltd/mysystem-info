import {
	useEffect,
	useState,
} from "react";

import { useAuth } from "../../data/auth/useAuth";
import { adminApi } from "../../data/api/adminApi";

import type {
	AdminRole,
	AdminUserCreateRequest,
} from "../../data/types/adminTypes";

import "../../styles/app-styles/administration/AdminCreateUserModal.css";

type AdminCreateUserModalProps = {
	onClose: () => void;
	onUserCreated: () => void;
};

const AdminCreateUserModal = ({
	onClose,
	onUserCreated,
}: AdminCreateUserModalProps) => {
	const { user: currentUser } = useAuth();

	// =====================================================
	// General state
	// =====================================================

	const [username, setUsername] =
		useState("");

	const [email, setEmail] =
		useState("");

	const [firstName, setFirstName] =
		useState("");

	const [lastName, setLastName] =
		useState("");

	const [telephone, setTelephone] =
		useState("");

	const [position, setPosition] =
		useState("");

	// =====================================================
	// Access state
	// =====================================================

	const [roles, setRoles] =
		useState<AdminRole[]>([]);

	const [selectedRole, setSelectedRole] =
		useState("");

	const [customerNos, setCustomerNos] =
		useState<string[]>([]);

	const [siteIds, setSiteIds] =
		useState<string[]>([]);

	const [customerNoEntry, setCustomerNoEntry] =
		useState("");

	const [siteIdEntry, setSiteIdEntry] =
		useState("");

	// =====================================================
	// Password state
	// =====================================================

	const [password, setPassword] =
		useState("");

	const [confirmPassword, setConfirmPassword] =
		useState("");

	// =====================================================
	// Request state
	// =====================================================

	const [isLoadingRoles, setIsLoadingRoles] =
		useState(false);

	const [isCreating, setIsCreating] =
		useState(false);

	const [error, setError] =
		useState("");

	// =====================================================
	// Permissions
	// =====================================================

	const currentUserIsAdministrator =
		currentUser?.roles.includes("Administrator") ?? false;

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
	// Customer access helpers
	// =====================================================

	const handleAddCustomerNo = () => {
		const cleanValue =
			customerNoEntry
				.trim()
				.toUpperCase();

		if (!cleanValue) {
			return;
		}

		if (customerNos.includes(cleanValue)) {
			setError(
				"That customer number has already been added."
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

	// =====================================================
	// Site access helpers
	// =====================================================

	const handleAddSiteId = () => {
		const cleanValue =
			siteIdEntry
				.trim()
				.toUpperCase();

		if (!cleanValue) {
			return;
		}

		if (siteIds.includes(cleanValue)) {
			setError(
				"That Site ID has already been added."
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
	// Password validation
	// =====================================================

	const checkSecurePassword = (
		value: string
	): boolean => {
		return (
			value.length >= 8 &&
			/[a-z]/.test(value) &&
			/[A-Z]/.test(value) &&
			/[0-9]/.test(value) &&
			/[.,()[\]{}!£$%^&*<>?/]/.test(value)
		);
	};

	// =====================================================
	// Create user
	// =====================================================

	const handleCreateUser = async () => {
		setError("");

		if (!currentUserIsAdministrator) {
			setError(
				"Only Administrators can create portal users."
			);

			return;
		}

		if (!username.trim()) {
			setError("Username is required.");
			return;
		}

		if (!firstName.trim()) {
			setError("First name is required.");
			return;
		}

		if (!lastName.trim()) {
			setError("Last name is required.");
			return;
		}

		if (!email.trim()) {
			setError("Email is required.");
			return;
		}

		if (!selectedRole) {
			setError("Please select a role.");
			return;
		}

		if (!checkSecurePassword(password)) {
			setError(
				"The password does not meet the security requirements."
			);

			return;
		}

		if (password !== confirmPassword) {
			setError(
				"Password and confirmation do not match."
			);

			return;
		}

		const request: AdminUserCreateRequest = {
			username: username.trim(),
			email: email.trim(),
			password,
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			telephone:
				telephone.trim() || null,
			role: selectedRole,
			position:
				position.trim() || null,
			customerNos,
			siteIds,
		};

		try {
			setIsCreating(true);

			await adminApi.createUser(
				request
			);

			onUserCreated();
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to create user."
			);
		} finally {
			setIsCreating(false);
		}
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div
			className="admin-create-modal-backdrop"
			role="presentation"
			onMouseDown={(event) => {
				if (
					event.target ===
					event.currentTarget
				) {
					onClose();
				}
			}}
		>
			<div
				className="admin-create-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="admin-create-user-heading"
			>
				{/* =================================================
				    Header
				================================================= */}

				<div className="admin-create-modal-header">
					<div>
						<p className="admin-create-modal-eyebrow">
							User Administration
						</p>

						<h2 id="admin-create-user-heading">
							Create User
						</h2>

						<p>
							Create a new mysystem.info portal account.
						</p>
					</div>

					<button
						type="button"
						className="admin-create-modal-close"
						onClick={onClose}
						aria-label="Close create user modal"
					>
						×
					</button>
				</div>

				{/* =================================================
				    Content
				================================================= */}

				<div className="admin-create-modal-content">
					{/* =============================================
					    General information
					============================================= */}

					<section className="acu-section">
						<h3>General Information</h3>

						<div className="acu-grid">
							<div className="acu-field">
								<label htmlFor="acu-username">
									Username
								</label>

								<input
									id="acu-username"
									type="text"
									value={username}
									onChange={(event) =>
										setUsername(
											event.target.value
										)
									}
								/>
							</div>

							<div className="acu-field">
								<label htmlFor="acu-email">
									Email
								</label>

								<input
									id="acu-email"
									type="email"
									value={email}
									onChange={(event) =>
										setEmail(
											event.target.value
										)
									}
								/>
							</div>

							<div className="acu-field">
								<label htmlFor="acu-first-name">
									First Name
								</label>

								<input
									id="acu-first-name"
									type="text"
									value={firstName}
									onChange={(event) =>
										setFirstName(
											event.target.value
										)
									}
								/>
							</div>

							<div className="acu-field">
								<label htmlFor="acu-last-name">
									Last Name
								</label>

								<input
									id="acu-last-name"
									type="text"
									value={lastName}
									onChange={(event) =>
										setLastName(
											event.target.value
										)
									}
								/>
							</div>

							<div className="acu-field">
								<label htmlFor="acu-telephone">
									Telephone
								</label>

								<input
									id="acu-telephone"
									type="tel"
									value={telephone}
									onChange={(event) =>
										setTelephone(
											event.target.value
										)
									}
								/>
							</div>

							<div className="acu-field">
								<label htmlFor="acu-position">
									Position
								</label>

								<input
									id="acu-position"
									type="text"
									value={position}
									onChange={(event) =>
										setPosition(
											event.target.value
										)
									}
								/>
							</div>
						</div>
					</section>

					{/* =============================================
					    Access
					============================================= */}

					<section className="acu-section">
						<h3>User Access</h3>

						<div className="acu-field">
							<label htmlFor="acu-role">
								Role
							</label>

							<select
								id="acu-role"
								value={selectedRole}
								disabled={isLoadingRoles}
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

						<div className="acu-access-block">
							<div>
								<h4>Customer Access</h4>

								<p>
									Add any customer numbers this
									account should be able to access.
								</p>
							</div>

							<div className="acu-chip-list">
								{customerNos.length === 0 ? (
									<span className="acu-empty">
										No customer numbers assigned.
									</span>
								) : (
									customerNos.map(
										(customerNo) => (
											<span
												key={customerNo}
												className="acu-chip"
											>
												{customerNo}

												<button
													type="button"
													onClick={() =>
														handleRemoveCustomerNo(
															customerNo
														)
													}
													aria-label={
														`Remove customer ${customerNo}`
													}
												>
													×
												</button>
											</span>
										)
									)
								)}
							</div>

							<div className="acu-entry-row">
								<input
									type="text"
									placeholder="Customer No"
									value={customerNoEntry}
									onChange={(event) =>
										setCustomerNoEntry(
											event.target.value
										)
									}
									onKeyDown={(event) => {
										if (
											event.key === "Enter"
										) {
											event.preventDefault();
											handleAddCustomerNo();
										}
									}}
								/>

								<button
									type="button"
									disabled={
										!customerNoEntry.trim()
									}
									onClick={
										handleAddCustomerNo
									}
								>
									Add
								</button>
							</div>
						</div>

						<div className="acu-access-block">
							<div>
								<h4>Site Access</h4>

								<p>
									Add any Site IDs this account
									should be able to access.
								</p>
							</div>

							<div className="acu-chip-list">
								{siteIds.length === 0 ? (
									<span className="acu-empty">
										No Site IDs assigned.
									</span>
								) : (
									siteIds.map((siteId) => (
										<span
											key={siteId}
											className="acu-chip"
										>
											{siteId}

											<button
												type="button"
												onClick={() =>
													handleRemoveSiteId(
														siteId
													)
												}
												aria-label={
													`Remove site ${siteId}`
												}
											>
												×
											</button>
										</span>
									))
								)}
							</div>

							<div className="acu-entry-row">
								<input
									type="text"
									placeholder="Site ID"
									value={siteIdEntry}
									onChange={(event) =>
										setSiteIdEntry(
											event.target.value
										)
									}
									onKeyDown={(event) => {
										if (
											event.key === "Enter"
										) {
											event.preventDefault();
											handleAddSiteId();
										}
									}}
								/>

								<button
									type="button"
									disabled={
										!siteIdEntry.trim()
									}
									onClick={
										handleAddSiteId
									}
								>
									Add
								</button>
							</div>
						</div>
					</section>

					{/* =============================================
					    Initial password
					============================================= */}

					<section className="acu-section">
						<h3>Initial Password</h3>

						<p className="acu-section-description">
							Set the user's initial portal password.
							The account will be active immediately
							after creation.
						</p>

						<div className="acu-grid">
							<div className="acu-field">
								<label htmlFor="acu-password">
									Password
								</label>

								<input
									id="acu-password"
									type="password"
									autoComplete="new-password"
									value={password}
									onChange={(event) =>
										setPassword(
											event.target.value
										)
									}
								/>
							</div>

							<div className="acu-field">
								<label htmlFor="acu-confirm-password">
									Confirm Password
								</label>

								<input
									id="acu-confirm-password"
									type="password"
									autoComplete="new-password"
									value={confirmPassword}
									onChange={(event) =>
										setConfirmPassword(
											event.target.value
										)
									}
								/>
							</div>
						</div>

						<p className="acu-password-requirements">
							Password must be at least 8 characters
							long and contain at least one lowercase
							letter, one uppercase letter, one number,
							and one special character.
						</p>
					</section>

					{/* =============================================
					    Error
					============================================= */}

					{error && (
						<p className="acu-error">
							{error}
						</p>
					)}
				</div>

				{/* =================================================
				    Footer
				================================================= */}

				<div className="admin-create-modal-footer">
					<button
						type="button"
						className="acu-cancel-button"
						disabled={isCreating}
						onClick={onClose}
					>
						Cancel
					</button>

					<button
						type="button"
						className="acu-create-button"
						disabled={
							isCreating ||
							isLoadingRoles ||
							!currentUserIsAdministrator
						}
						onClick={() =>
							void handleCreateUser()
						}
					>
						{isCreating
							? "Creating..."
							: "Create User"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AdminCreateUserModal;