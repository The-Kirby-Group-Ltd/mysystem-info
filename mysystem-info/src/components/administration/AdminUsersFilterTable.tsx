import type {
	AdminUserFilters,
} from "../../data/types/adminTypes";

type AdminUsersFilterTableProps = {
	filters: AdminUserFilters;
	onFiltersChange: (
		filters: AdminUserFilters
	) => void;
	onSearch: () => void;
	onClear: () => void;
	isLoading: boolean;
};

const AdminUsersFilterTable = ({
	filters,
	onFiltersChange,
	onSearch,
	onClear,
	isLoading,
}: AdminUsersFilterTableProps) => {
	// =====================================================
	// Helpers
	// =====================================================

	const updateFilter = (
		field: keyof AdminUserFilters,
		value: string
	) => {
		onFiltersChange({
			...filters,
			[field]: value,
		});
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="admin-users-filter-table">
			<div className="admin-filter-grid">
				<div className="admin-filter-field">
					<label htmlFor="admin-filter-user-id">
						User ID
					</label>

					<input
						id="admin-filter-user-id"
						type="text"
						value={filters.userId}
						onChange={(event) =>
							updateFilter(
								"userId",
								event.target.value
							)
						}
					/>
				</div>

				<div className="admin-filter-field">
					<label htmlFor="admin-filter-active">
						Active State
					</label>

					<select
						id="admin-filter-active"
						value={filters.isActive}
						onChange={(event) =>
							updateFilter(
								"isActive",
								event.target.value
							)
						}
					>
						<option value="">
							All
						</option>

						<option value="true">
							Active
						</option>

						<option value="false">
							Inactive
						</option>
					</select>
				</div>

				<div className="admin-filter-field">
					<label htmlFor="admin-filter-role">
						Role
					</label>

                    <select
						id="admin-filter-active"
						value={filters.role}
						onChange={(event) =>
							updateFilter(
								"role",
								event.target.value
							)
						}
					>
                        <option value="">All</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Staff">Kirby Security Staff</option>
                        <option value="Engineer">Kirby Security Engineer</option>
                        <option value="CustomerUser">Customer User</option>
                        <option value="SiteUser">Site User</option>
                    </select>
				</div>

				<div className="admin-filter-field">
					<label htmlFor="admin-filter-customer">
						Customer No
					</label>

					<input
						id="admin-filter-customer"
						type="text"
						value={filters.customerNo}
						onChange={(event) =>
							updateFilter(
								"customerNo",
								event.target.value
							)
						}
					/>
				</div>

				<div className="admin-filter-field">
					<label htmlFor="admin-filter-site">
						Site ID
					</label>

					<input
						id="admin-filter-site"
						type="text"
						value={filters.siteId}
						onChange={(event) =>
							updateFilter(
								"siteId",
								event.target.value
							)
						}
					/>
				</div>
			</div>

			<div className="admin-filter-actions">
				<button
					type="button"
					disabled={isLoading}
					onClick={onClear}
				>
					Clear
				</button>

				<button
					type="button"
					disabled={isLoading}
					onClick={onSearch}
				>
					{isLoading
						? "Searching..."
						: "Search"}
				</button>
			</div>
		</div>
	);
};

export default AdminUsersFilterTable;