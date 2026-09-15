import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./styles/App.css";

import { AuthProvider } from "./data/auth/AuthContext";
import { ProtectedRoute } from "./data/auth/ProtectedRoute";
import { RoleRoute } from "./data/auth/RoleRoute";

import Login from "./components/Login";
import SideBar from "./components/SideBar";

import Dashboard from "./app/Dashboard";
import Sites from "./app/Sites";
import Calls from "./app/Calls";
import Settings from "./app/Settings";
import Administration from "./app/Administration";
import EventsCalendar from "./app/EventsCalendar";

const Unauthorized = () => <h1>Unauthorized</h1>;

const PortalShell = () => {
	return (
		<div className="portal-layout">
			<SideBar />

			<main className="portal-main">
				<Outlet />
			</main>
		</div>
	);
};

const App = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/unauthorized" element={<Unauthorized />} />

					<Route element={<ProtectedRoute />}>
						<Route path="/app" element={<PortalShell />}>
							<Route index element={<Navigate to="dashboard" replace />} />

							<Route path="dashboard" element={<Dashboard />} />
							<Route path="sites" element={<Sites />} />
							<Route path="calls" element={<Calls />} />
							<Route path="settings" element={<Settings />} />
							<Route path="calendar" element={<EventsCalendar />} />

							<Route
								element={
									<RoleRoute
										allowedRoles={["Administrator", "Staff"]}
									/>
								}
							>
								<Route
									path="administration"
									element={<Administration />}
								/>
							</Route>
						</Route>
					</Route>

					<Route path="/" element={<Navigate to="/app/dashboard" replace />} />
					<Route path="*" element={<Navigate to="/app/dashboard" replace />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
};

export default App;