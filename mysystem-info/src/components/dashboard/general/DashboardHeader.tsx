type DashboardHeaderProps = {
	customerNo: string;
	searchedCustomerNo: string;

	specificSite: boolean;
	siteId: string;
	searchedSiteId: string;

	onCustomerNoChange: (value: string) => void;
	onSpecificSiteChange: (value: boolean) => void;
	onSiteIdChange: (value: string) => void;

	onSearch: () => void;
};

const DashboardHeader = ({
	customerNo,
	searchedCustomerNo,

	specificSite,
	siteId,
	searchedSiteId,

	onCustomerNoChange,
	onSpecificSiteChange,
	onSiteIdChange,

	onSearch,
}: DashboardHeaderProps) => {
	return (
		<header className="dashboard-header">
			<div>
				<h1 className="dashboard-heading">
					Dashboard
				</h1>

				{searchedCustomerNo && (
					<p className="dashboard-subtitle">
						Showing customer{" "}
						<strong className="shown-customerno-heading">
							{searchedCustomerNo}
						</strong>

						{searchedSiteId && (
							<>
								{" "}— Site{" "}
								<strong className="shown-siteid-heading">
									{searchedSiteId}
								</strong>
							</>
						)}
					</p>
				)}
			</div>

			<div className="dashboard-search-area">
				<div className="dashboard-customer-search">
					<input
						type="text"
						placeholder="Customer No"
						value={customerNo}
						onChange={(event) =>
							onCustomerNoChange(
								event.target.value
							)
						}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								onSearch();
							}
						}}
					/>

					<button
						type="button"
						onClick={onSearch}
					>
						Search
					</button>
				</div>

				<div className="dashboard-site-filter">
					<label className="dashboard-site-checkbox">
						<input
							type="checkbox"
							checked={specificSite}
							onChange={(event) =>
								onSpecificSiteChange(
									event.target.checked
								)
							}
						/>

						<span>Specific Site</span>
					</label>

					<input
						type="text"
						className="dashboard-site-input"
						placeholder="Site ID"
						value={siteId}
						disabled={!specificSite}
						onChange={(event) =>
							onSiteIdChange(
								event.target.value
							)
						}
						onKeyDown={(event) => {
							if (
								event.key === "Enter" &&
								specificSite
							) {
								onSearch();
							}
						}}
					/>
				</div>
			</div>
		</header>
	);
};

export default DashboardHeader;