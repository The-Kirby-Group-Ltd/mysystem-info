import type {
	AdminUser,
} from "../../data/types/adminTypes";

type AdminUsersTableProps = {
	users: AdminUser[];
	isLoading: boolean;
	onUserClick: (
		user: AdminUser
	) => void;
};

const AdminUsersTable = ({
	users,
	isLoading,
	onUserClick,
}: AdminUsersTableProps) => {
	// =====================================================
	// Render helpers
	// =====================================================

	const renderAccessCount = (
		values: string[],
		label: string
	) => {
		if (values.length === 0) {
			return "—";
		}

		if (values.length === 1) {
			return values[0];
		}

		return `${values.length} ${label}`;
	};

    const shortenUserId = (userId: string) => {
        if (userId.length <= 14) {
            return userId;
        }

        return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
    };

	// =====================================================
	// Render
	// =====================================================

	if (isLoading) {
		return (
			<div className="admin-users-table-message">
				Loading users...
			</div>
		);
	}

	if (users.length === 0) {
		return (
			<div className="admin-users-table-message">
				No users found.
			</div>
		);
	}

	return (
		<div className="admin-users-table-wrapper">
			<table className="admin-users-table">
				<thead>
					<tr>
						<th>User ID</th>
						<th>Username</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role(s)</th>
						<th>Customers</th>
						<th>Sites</th>
						<th>Status</th>
					</tr>
				</thead>

				<tbody>
					{users.map((user) => (
						<tr key={user.userId}>
							<td>
                                <button
                                    type="button"
                                    className="admin-user-id-link"
                                    title={user.userId}
                                    onClick={() => onUserClick(user)}
                                >
                                    {shortenUserId(user.userId)}
                                </button>
							</td>

							<td>
								{user.username}
							</td>

							<td>
								{user.firstName}{" "}
								{user.lastName}
							</td>

							<td>
								{user.email}
							</td>

							<td>
								{user.roles.length > 0
									? user.roles
                                        .map(c => 
                                            c == "CustomerUser" 
                                                ? "Customer User"
                                                : c == "SiteUser"
                                                    ? "Site User"
                                                    : c
                                        ).join(", ")
									: "—"}
							</td>

							<td>
								{renderAccessCount(
									user.customerNos,
									"Customers"
								)}
							</td>

							<td>
								{renderAccessCount(
									user.siteIds,
									"Sites"
								)}
							</td>

							<td>
								<span
									className={
										user.isActive
											? "admin-user-status admin-user-status-active"
											: "admin-user-status admin-user-status-inactive"
									}
								>
									{user.isActive
										? "Active"
										: "Inactive"}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AdminUsersTable;