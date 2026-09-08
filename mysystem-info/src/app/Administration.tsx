import "../styles/app-styles/administration/Administration.css";

import {
	useEffect,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../data/auth/useAuth";
import { adminApi } from "../data/api/adminApi";

import type {
	AdminUser,
	AdminUserFilters,
} from "../data/types/adminTypes";

import {
	getStoredPreferredPageSize,
} from "../data/storage/settingsStorage";

import AdminUserModal
	from "../components/administration/AdminUserModal";
import AdminUsersFilterTable
	from "../components/administration/AdminUsersFilterTable";
import AdminUsersTable
	from "../components/administration/AdminUsersTable";

// =========================================================
// Defaults
// =========================================================

const emptyFilters: AdminUserFilters = {
	userId: "",
	role: "",
	customerNo: "",
	siteId: "",
	isActive: "",
};

const Administration = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	// =====================================================
	// User state
	// =====================================================

	const [users, setUsers] =
		useState<AdminUser[]>([]);

	const [selectedUser, setSelectedUser] =
		useState<AdminUser | null>(null);

	// =====================================================
	// Filter state
	// =====================================================

	const [filters, setFilters] =
		useState<AdminUserFilters>(emptyFilters);

	// =====================================================
	// Pagination state
	// =====================================================

	const [page, setPage] =
		useState(1);

	const [pageInput, setPageInput] =
		useState("1");

	const [rowsToShow, setRowsToShow] =
		useState(() => {
			const stored =
				getStoredPreferredPageSize();

			switch (stored) {
				case 25:
					return 25;

				case 30:
					return 30;

				case 50:
					return 50;

				case 100:
					return 100;

				default:
					return 10;
			}
		});

	// =====================================================
	// Request state
	// =====================================================

	const [error, setError] =
		useState("");

	const [isLoading, setIsLoading] =
		useState(false);

	// =====================================================
	// Derived pagination
	// =====================================================

	const totalPages =
		Math.max(
			1,
			Math.ceil(
				users.length / rowsToShow
			)
		);

	const hasMore =
		page < totalPages;

	const pagedUsers =
		users.slice(
			(page - 1) * rowsToShow,
			page * rowsToShow
		);

	// =====================================================
	// Page access
	// =====================================================

	useEffect(() => {
		if (!user) {
			navigate(
				"/login",
				{ replace: true }
			);

			return;
		}

		const canAccessAdministration =
			user.roles.includes("Administrator") ||
			user.roles.includes("Staff");

		if (!canAccessAdministration) {
			navigate(
				"/app/dashboard",
				{ replace: true }
			);
		}
	}, [
		user,
		navigate,
	]);

	// =====================================================
	// Load users
	// =====================================================

	const loadUsers = async (
		filtersToLoad: AdminUserFilters = filters
	) => {
		setError("");

		try {
			setIsLoading(true);

			const result =
				await adminApi.getUsers(
					filtersToLoad
				);

			setUsers(result);

			setPage(1);
			setPageInput("1");
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to load users."
			);
		} finally {
			setIsLoading(false);
		}
	};

	// =====================================================
	// Initial user load
	// =====================================================

	useEffect(() => {
		if (!user) {
			return;
		}

		const canAccessAdministration =
			user.roles.includes("Administrator") ||
			user.roles.includes("Staff");

		if (!canAccessAdministration) {
			return;
		}

		void loadUsers(emptyFilters);
	}, [user]);

	// =====================================================
	// Filter handlers
	// =====================================================

	const handleSearch = () => {
		void loadUsers(filters);
	};

	const handleClearFilters = () => {
		setFilters(emptyFilters);

		void loadUsers(emptyFilters);
	};

	// =====================================================
	// Pagination handlers
	// =====================================================

	const handlePageSubmit = () => {
		const requestedPage =
			Number(pageInput);

		if (
			!Number.isInteger(requestedPage) ||
			requestedPage < 1
		) {
			setError(
				"Please enter a valid page number."
			);

			return;
		}

		if (requestedPage > totalPages) {
			setError(
				`Page number cannot be greater than ${totalPages}.`
			);

			return;
		}

		setError("");

		setPage(requestedPage);

		setPageInput(
			requestedPage.toString()
		);
	};

	const handleRowsChange = (
		value: number
	) => {
		const cleanValue =
			Math.min(
				Math.max(value, 1),
				100
			);

		setRowsToShow(cleanValue);

		setPage(1);
		setPageInput("1");
	};

	const handlePreviousPage = () => {
		if (page <= 1) {
			return;
		}

		const newPage =
			page - 1;

		setPage(newPage);
		setPageInput(newPage.toString());
	};

	const handleNextPage = () => {
		if (!hasMore) {
			return;
		}

		const newPage =
			page + 1;

		setPage(newPage);
		setPageInput(newPage.toString());
	};

	// =====================================================
	// User modal handlers
	// =====================================================

	const handleUserUpdated = () => {
		setSelectedUser(null);

		void loadUsers(filters);
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="admin-screen">
			{/* =================================================
			    Header
			================================================= */}

			<div className="admin-header">
				<div>
					<p className="admin-eyebrow">
						Company Management
					</p>

					<h1 className="admin-heading">
						Administration
					</h1>
				</div>
			</div>

			{/* =================================================
			    Filters
			================================================= */}

			<section className="users-controls-card">
				<div className="users-controls-heading">
					<div>
						<p className="admin-section-eyebrow">
							Filters
						</p>

						<h2>
							Find users
						</h2>
					</div>

					<div className="users-toolbar">
						<label className="users-toolbar-control">
							<span>
								Rows
							</span>

							<input
								type="number"
								min={1}
								max={100}
								value={rowsToShow}
								onChange={(event) =>
									handleRowsChange(
										Number(
											event.target.value
										)
									)
								}
							/>
						</label>
					</div>
				</div>

				<AdminUsersFilterTable
					filters={filters}
					onFiltersChange={setFilters}
					onSearch={handleSearch}
					onClear={handleClearFilters}
					isLoading={isLoading}
				/>
			</section>

			{/* =================================================
			    Error
			================================================= */}

			{error && (
				<p className="admin-error">
					{error}
				</p>
			)}

			{/* =================================================
			    Users table
			================================================= */}

			<div className="admin-users-view">
				<AdminUsersTable
					users={pagedUsers}
					isLoading={isLoading}
					onUserClick={setSelectedUser}
				/>
			</div>

			{/* =================================================
			    Pagination
			================================================= */}

			<div className="admin-pagination">
				<button
					type="button"
					className="admin-pagination-button"
					disabled={
						page <= 1 ||
						isLoading
					}
					onClick={
						handlePreviousPage
					}
				>
					‹
				</button>

				<div className="admin-page-jump">
					<span>
						Page
					</span>

					<input
						type="number"
						min={1}
						max={totalPages}
						value={pageInput}
						onChange={(event) =>
							setPageInput(
								event.target.value
							)
						}
						onKeyDown={(event) => {
							if (
								event.key === "Enter"
							) {
								handlePageSubmit();
							}
						}}
					/>

					<span className="admin-page-total">
						of {totalPages}
					</span>

					<button
						type="button"
						disabled={isLoading}
						onClick={
							handlePageSubmit
						}
					>
						Go
					</button>
				</div>

				<button
					type="button"
					className="admin-pagination-button"
					disabled={
						!hasMore ||
						isLoading
					}
					onClick={
						handleNextPage
					}
				>
					›
				</button>
			</div>

			{/* =================================================
			    User modal
			================================================= */}

			{selectedUser && (
				<AdminUserModal
					user={selectedUser}
					onClose={() =>
						setSelectedUser(null)
					}
					onUserUpdated={
						handleUserUpdated
					}
				/>
			)}
		</div>
	);
};

export default Administration;