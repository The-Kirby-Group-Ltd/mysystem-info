import type {
	AdminUser,
} from "../../data/types/adminTypes";

type AdminUserModalProps = {
	user: AdminUser;
	onClose: () => void;
	onUserUpdated: () => void;
};

const AdminUserModal = ({
	user,
	onClose,
	onUserUpdated,
}: AdminUserModalProps) => {
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

				<div className="admin-user-modal-header">
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
				</div>

				{/* =========================================
				    Content
				========================================= */}

				<div className="admin-user-modal-content">
					<p>
						User administration controls will go here.
					</p>

					<p>
						Username: <strong>{user.username}</strong>
					</p>

					<p>
						Email: <strong>{user.email}</strong>
					</p>

					<p>
						Status:{" "}
						<strong>
							{user.isActive
								? "Active"
								: "Inactive"}
						</strong>
					</p>
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