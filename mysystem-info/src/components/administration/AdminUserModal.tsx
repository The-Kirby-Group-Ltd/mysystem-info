import "../../styles/app-styles/administration/AdminUserModal.css";

import { useState, useEffect } from "react";

import { adminApi } from "../../data/api/adminApi";

import AdminUserGeneralTab from "./AdminUserGeneralTab";
import AdminUserAccessTab from "./AdminUserAccessTab";
import AdminUserSecurityTab from "./AdminUserSecurityTab";

import type {
	AdminUser,
} from "../../data/types/adminTypes";

type AdminUserModalProps = {
	user: AdminUser;
	onClose: () => void;
	onUserUpdated: () => void;
};

type AdminUserModalTab = 
	| "general"
	| "access"
	| "security";

const AdminUserModal = ({
	user,
	onClose,
	onUserUpdated,
}: AdminUserModalProps) => {

	// =====================================================
	// State
	// =====================================================

	const [userDetails, setUserDetails] = useState<AdminUser>(user);
	const [activeTab, setActiveTab] = useState<AdminUserModalTab>("general");

	const [isLoadingUser, setIsLoadingUser] = useState(false);
	const [error, setError] = useState("");

	// =====================================================
	// Allow closing with Esc
	// =====================================================

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		const previousOverflow = document.body.style.overflow;

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	// =====================================================
	// Load the user's full details
	// =====================================================

	useEffect(() => {
		let isCancelled = false;

		const loadUserDetails = async () => {
			setIsLoadingUser(true);
			setError("");

			try {
				const fullUser = await adminApi.getUserById(user?.userId);

				if (!isCancelled) {
					setUserDetails(fullUser);
				}
			} catch (error) {
				if (!isCancelled) 
					setError(error instanceof Error
						? error.message
						: "Failed to load the full user details.");
			} finally {
				if (!isCancelled) 
					setIsLoadingUser(false);
			}
		}

		setUserDetails(user);
		setActiveTab("general");
		loadUserDetails();

		return () => {
			isCancelled = true;
		}
	}, [user]);

	// =====================================================
	// Render
	// =====================================================

	return (
		<div
			className="admin-user-modal-backdrop"
			role="presentation"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<div
				className="admin-user-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="admin-user-modal-heading"
			>
				{/* =========================================
				    Header
				========================================= */}

				<header className="admin-user-modal-header">
					<div>
						<p className="admin-user-modal-eyebrow">
							User Administration
						</p>

						<h2 id="admin-user-modal-heading">
							{user.firstName}{" "}
							{user.lastName}
						</h2>

						<p>
							{user.userId}
						</p>
					</div>

					<button
						type="button"
						className="admin-user-modal-close"
						onClick={onClose}
						aria-label="Close user administration modal"
					>
						×
					</button>
				</header>

				{/* =========================================
				    Tab buttons
				========================================= */}

				<nav 
					className="admin-user-modal-tabs"
					aria-label="User details/interactives sections"
				>
					<button
						type="button"
						className={
							activeTab === "general"
								? "admin-user-modal-tab admin-user-modal-tab-active"
								: "admin-user-modal-tab"
						}
						onClick={() => setActiveTab("general")}
					>
						General
					</button>

					<button
						type="button"
						className={
							activeTab === "access"
								? "admin-user-modal-tab admin-user-modal-tab-active"
								: "admin-user-modal-tab"
						}
						onClick={() => setActiveTab("access")}
					>
						Access Rights
					</button>

					<button
						type="button"
						className={
							activeTab === "security"
								? "admin-user-modal-tab admin-user-modal-tab-active"
								: "admin-user-modal-tab"
						}
						onClick={() => setActiveTab("security")}
					>
						Security
					</button>
				</nav>

				{/* =========================================
				    Content
				========================================= */}

				<div className="admin-user-modal-content">
					{activeTab === "general" && (
						<AdminUserGeneralTab />
					)}

					{activeTab === "access" && (
						<AdminUserAccessTab />
					)}

					{activeTab === "security" && (
						<AdminUserSecurityTab />
					)}
				</div>

				{/* =========================================
				    Footer
				========================================= */}

				<div className="admin-user-modal-footer">
					<button
						type="button"
						onClick={onClose}
					>
						Close
					</button>

					<button
						type="button"
						onClick={onUserUpdated}
					>
						Refresh
					</button>
				</div>
			</div>
		</div>
	);
};

export default AdminUserModal;