import { useAuth } from "../../data/auth/useAuth";

const AccountSettingsCard = () => {
	const { user } = useAuth();

	if (!user) {
		return null;
	}

	return (
		<div className="account-settings">
			<div className="settings-card-heading">
				<h2>Account Information</h2>
			</div>

			<div className="settings-card-content">
				<div className="account-settings-grid">
					<div className="account-setting-field">
						<span>Name</span>
						<strong>
							{user.firstName} {user.lastName}
						</strong>
					</div>

					<div className="account-setting-field">
						<span>Username</span>
						<strong>{user.username}</strong>
					</div>

					<div className="account-setting-field">
						<span>Email</span>
						<strong>{user.email}</strong>
					</div>

					<div className="account-setting-field">
						<span>Role</span>
						<strong>
							{user.roles.join(", ")}
						</strong>
					</div>

					{user.customerNos.length > 0 && (
						<div className="account-setting-field account-setting-field-wide">
							<span>Customer Access</span>
							<strong>
								{user.customerNos.join(", ")}
							</strong>
						</div>
					)}

					{user.siteIds.length > 0 && (
						<div className="account-setting-field account-setting-field-wide">
							<span>Site Access</span>
							<strong>
								{user.siteIds.join(", ")}
							</strong>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AccountSettingsCard;