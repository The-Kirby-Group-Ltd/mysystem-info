import { useState } from "react";
import "../styles/LoginStyles.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/auth/useAuth";
import ChangePasswordModalNoAuth from "./auth/ChangePasswordModalNoAuth";

// documentation
import privacyNoticePdf 
	from "../assets/documentation/mysystem-info-privacy-notice.pdf";
import termsOfUsePdf
	from "../assets/documentation/mysystem-info-terms-of-use.pdf";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { login } = useAuth();

	// modal state
	const [passwordModalOpen, setPasswordModalOpen] = useState(false);

	const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		setError("");
		setStatus("");

		if (!username || !password) {
			setError("Please fill in all fields.");
			return;
		}

		try {
			setStatus("Logging in...");

			await login({
				username,
				password,
			});

			navigate("/app/dashboard");
		} catch (err) {
			setStatus("");
			setError(err instanceof Error ? err.message : "Login failed.");
		}
	};

	return (
		<div className="login-page">
			<div className="login-shell">
				<section className="login-intro">
					<div className="login-brand">
						<h1>
							mysystem<span>.info</span>
						</h1>

						<p>By The Kirby Group&copy;</p>
					</div>
				</section>

				<section className="login-box">
					<div className="login-box-heading">
						<h2>Log in</h2>
					</div>

					<form 
						className="login-form"
						onSubmit={handleLogin}
					>
						<div className="login-input-boxes">
							<label>
								<span>
									Username or Email
								</span>

								<input
									type="text"
									value={username}
									onChange={(e) => 
										setUsername(e.target.value)
									}
									autoComplete="username"
								/>
							</label>

							<label>
								<span>
									Password
								</span>

								<input
									type="password"
									value={password}
									onChange={(e) => 
										setPassword(e.target.value)
									}
									autoComplete="password"
								/>
							</label>

							<div className="forgot-password-wrapper">
								<button
									type="button"
									className="forgot-password-button"
									onClick={
										() => setPasswordModalOpen(true)
									}
								>
									Forgot Password?
								</button>
							</div>
						</div>

						{error && (
							<p className="login-error">
								{error}
							</p>
						)}

						{status && (
							<p className="login-status">
								{status}
							</p>
						)}

						<button
							className="login-button"
							type="submit"
						>
							Log in
						</button>
					</form>
				</section>
			</div>

			<div className="login-legal-links">
				<a 
					href={termsOfUsePdf}
					download="mysystem-info-terms-of-use.pdf"
				>
					Terms & Conditions
				</a>

				<span>|</span>

				<a 
					href={privacyNoticePdf}
					download="mysystem-info-privacy-notice.pdf"
				>
					Privacy Policy
				</a>
			</div>

			{passwordModalOpen && (
				<ChangePasswordModalNoAuth 
					email={
						username.includes("@") 
							? username 
							: ""
					}
					onClose={
						() => setPasswordModalOpen(false)
					}
				/>
			)}
		</div>		
	);
};

export default Login;