import { NavLink } from "react-router-dom";

const DashboardWelcome = () => {
	return (
		<section className="dashboard-welcome-section">
			<div className="dashboard-welcome-copy">
				<h3>
					Welcome to mysystem.
					<span className="site-name">
						info
					</span>
					!
				</h3>

				<p>
					View your sites, calls, maintenance
					information and service activity.
				</p>
			</div>

			<div className="dashboard-route-buttons">
				<NavLink
					to="/app/sites"
					className="dashboard-route-button"
				>
					<span>My Sites</span>
					<strong>›</strong>
				</NavLink>

				<NavLink
					to="/app/calls"
					className="dashboard-route-button"
				>
					<span>Calls</span>
					<strong>›</strong>
				</NavLink>

				<NavLink
					to="/app/calendar"
					className="dashboard-route-button"
				>
					<span>Events Calendar</span>
					<strong>›</strong>
				</NavLink>
			</div>
		</section>
	);
};

export default DashboardWelcome;