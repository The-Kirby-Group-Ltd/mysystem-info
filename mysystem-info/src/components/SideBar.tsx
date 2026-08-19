import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../data/auth/useAuth";

const SideBar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const canAccessAdmin =
		user?.roles.includes("Administrator") ||
		user?.roles.includes("Staff");

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			alert(`Log out failed. Please try again. \n\nError: ${error}`);
		}
	};

	return (
		<aside className="sidebar">
			<div className="sidebar-header">
				<div className="sidebar-brand">
					<h2>
						mysystem<span>.info</span>
					</h2>

					<p>By The Kirby Group&copy;</p>
				</div>
			</div>

			<nav className="sidebar-nav">
				<p className="sidebar-section-label">
					Portal
				</p>

				<ul>
					<li>
						<NavLink to="/app/dashboard">
							<span className="sidebar-nav-marker" />
							<span>Dashboard</span>
						</NavLink>
					</li>

					<li>
						<NavLink to="/app/sites">
							<span className="sidebar-nav-marker" />
							<span>Sites</span>
						</NavLink>
					</li>

					<li>
						<NavLink to="/app/calls">
							<span className="sidebar-nav-marker" />
							<span>Calls</span>
						</NavLink>
					</li>
				</ul>

				<p className="sidebar-section-label">
					Account
				</p>

				<ul>
					<li>
						<NavLink to="/app/settings">
							<span className="sidebar-nav-marker" />
							<span>Settings</span>
						</NavLink>
					</li>

					{canAccessAdmin && (
						<li>
							<NavLink to="/app/administration">
								<span className="sidebar-nav-marker" />
								<span>Administration</span>
							</NavLink>
						</li>
					)}
				</ul>
			</nav>

			<div className="sidebar-footer">
				<div className="sidebar-user">
					<div className="sidebar-user-avatar">
						{user?.username
							?.charAt(0)
							.toUpperCase() || "U"}
					</div>

					<div className="sidebar-user-details">
						<strong>
							{user?.username || "User"}
						</strong>

						<span>
							{user?.roles?.[0] || "Portal User"}
						</span>
					</div>
				</div>

				<div className="sidebar-logout">
					<button
						className="sidebar-logout-button"
						type="button"
						onClick={handleLogout}
						title="Log out"
						aria-label="Log out"
					>
						<span className="sidebar-logout-icon" />
					</button>
				</div>
			</div>
		</aside>
	);
};

export default SideBar;