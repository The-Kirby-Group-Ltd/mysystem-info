import { useAuth } from "../data/auth/useAuth";
import { useNavigate } from "react-router-dom";

import "../styles/app-styles/settings/Settings.css";

import PortalPreferencesCard from "../components/settings/PortalPreferencesCard";

const Settings = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	// =====================================================
	// Log out
	// =====================================================

	const handleLogout = async () => {
		try {
			await logout();

			navigate(
				"/login",
				{ replace: true }
			);
		} catch (error) {
			alert(
				`Log out failed. Please try again.\n\nError: ${error}`
			);
		}
	};

	// =====================================================
	// Render
	// =====================================================

	return (
		<div className="settings-screen">
			{/* =============================================
			    Header
			============================================= */}

			<header className="settings-header">
				<div>
					<p className="settings-eyebrow">
						User Preferences
					</p>

					<h1 className="settings-heading">
						Settings
					</h1>

					<p className="settings-subtitle">
						Manage your account and portal preferences.
					</p>
				</div>

				{user && (
					<div className="settings-user-summary">
						<span>
							Signed in as
						</span>

						<strong>
							{user.firstName}{" "}
							{user.lastName}
						</strong>

						<p>
							{user.email}
						</p>
					</div>
				)}
			</header>

			{/* =============================================
			    Settings sections
			============================================= */}

			<div className="settings-sections">
				<section className="settings-card account-settings-section">
					<div className="settings-card-heading">
                        <h2>
                            Account Information
                        </h2>
					</div>

					<div className="settings-card-content">
						{/* Account information/settings will go here */}
					</div>
				</section>

				<section className="settings-card portal-preferences-section">
                    <PortalPreferencesCard />
				</section>

				<section className="settings-card session-section">
					<div className="settings-card-heading">
                        <h2>
                            This Session
                        </h2>
					</div>

					<div className="settings-session-content">
						<div className="logged-in-as">
							<span>
								Signed in as
							</span>

							<strong>
								{user
									? `${user.firstName} ${user.lastName}`
									: "Portal User"}
							</strong>
						</div>

						<button
							className="settings-logout-button"
							type="button"
							onClick={handleLogout}
							title="Log out"
							aria-label="Log out"
						>
							<span>
								Log out
							</span>

							<span
								className="settings-logout-icon"
								aria-hidden="true"
							/>
						</button>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Settings;