import type { AdminUser } from "../../data/types/adminTypes";

type AdminUserGeneralTabProps = {
    user: AdminUser;
    isLoading?: boolean;
}

const AdminUserGeneralTab = ({
    user, isLoading = false,
}: AdminUserGeneralTabProps) => {
    const activeState = user?.isActive
        ? "Active"
        : "Deactivated";

    return (
        <div className="aum-general-tab">
            {/* loading */}
            {isLoading && (
                <p className="aum-loading">
                    Loading user details...
                </p>
            )}

            {/* =========================================
                Footer
            ========================================= */}

            <section className="user-detail-section">
                <h3>User Information</h3>

                <div className="user-detail-grid">
                    <div className="user-detail-field">
                        <span>User ID</span>
                        <strong>{user.userId || "—"}</strong>
                    </div>

                    <div className="user-detail-field">
                        <span>Username</span>
                        <strong>{user.username || "—"}</strong>
                    </div>

                    <div className="user-detail-field">
                        <span>Email</span>
                        <strong>{user.email || "—"}</strong>
                    </div>

                    <div className="user-detail-field">
                        <span>Telephone</span>
                        <strong>{user.telephone || "—"}</strong>
                    </div>

                    <div className="user-detail-field user-detail-field-wide">
                        <span>Status</span>
                        <strong>
                            {activeState}
                        </strong>
                    </div>
                </div>
            </section>
        </div> 
    );
}

export default AdminUserGeneralTab;