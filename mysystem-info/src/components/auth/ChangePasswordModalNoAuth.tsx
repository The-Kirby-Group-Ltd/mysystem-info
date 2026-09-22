import { useEffect, useState } from "react";
import { authApi } from "../../data/api/authApi";

type cpmnaProps = {
    email: string;
    onClose: () => void;
}

const ChangePasswordModalNoAuth = ({
    email,
    onClose,
}: cpmnaProps) => {
    
    // =========================================
    // State
    // =========================================

    // Form state
    const [emailAddress, setEmailAddress] = useState(email);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");

    // Request state
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================
    // Modal behaviour
    // =========================================

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key == "Escape") {
                onClose();
            }
        }

        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = overflow;
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [onClose]);

    // =========================================
    // Helpers
    // =========================================

    const resetMessages = () => {
        setError("");
        setSuccess("");
    };

    const validateEmail = (): string | null => {
        const cleanEmail = emailAddress
            .trim()
            .toLowerCase();

        if (!cleanEmail) {
            setError("Please enter your registered email address.");
            return null;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            setError("Please enter a valid email address.");
            return null;
        }

        return cleanEmail;
    }

    const validateForm = (): boolean => {
        if (!newPassword) {
            setError("Please enter a new password.");
            return false;
        }

        if (newPassword.length < 8) {
            setError("Your new password must be a minimum of 8 characters.");
            return false;
        }

        var newPasswordIsSecure = checkSecurePassword(newPassword);
        if (!newPasswordIsSecure) {
            setError("Your password does not meet the security requirements.");
            return false;
        }

        if (verificationCode.length !== 6 || 
            !/^\d{6}$/.test(verificationCode)
        ) {
            setError("Please enter the six-digit verification code.");
            return false;
        }

        return true;
    }

    const checkSecurePassword = (password: string): boolean => {
        const lowers        = "abcdefghijklmnopqrstuvwxyz";
        const uppers        = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers       = "1234567890";
        const specials      = ".,()[]{}!£$%^&*<>?/";

        const hasLower      = lowers.split("").some(c => password.includes(c));
        const hasUpper      = uppers.split("").some(c => password.includes(c));
        const hasNumber     = numbers.split("").some(c => password.includes(c));
        const hasSpecial    = specials.split("").some(c => password.includes(c));

        if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
            return false;
        }

        return true; 
    }

    // =========================================
    // Send verification code
    // =========================================

    const handleSendCode = async () => {
        resetMessages();

        const cleanEmail = validateEmail();

        if (!cleanEmail)
            return;

        try {
            setIsSendingCode(true);

            const response =
                await authApi.requestForgotPasswordAuthCode(
                    cleanEmail
                );

            setCodeSent(true);

            setSuccess(
                response.message ||
                "Verification code sent."
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to send verification code."
            );
        } finally {
            setIsSendingCode(false);
        }
    };

    // =========================================
    // Handle change password
    // =========================================

    const handleChangePassword = async () => {
        resetMessages();

        if (!validateForm()) {
            return;
        }
        
        try {
            setIsChangingPassword(true);
            
            const response = await authApi.requestForgotPasswordNew({
                newPassword,
                verificationCode,
            });

            setSuccess(
                response.message ||
                "Password changed successfully."
            );

            setNewPassword("");
            setConfirmPassword("");
            setVerificationCode("");
            setCodeSent(false);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to change password."
            );
        } finally {
            setIsChangingPassword(false);
        };
    }
    
    // =========================================
    // Render
    // =========================================
    
    return (
        <div 
            className="change-password-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if((event).target === event.currentTarget)
                    onClose();
            }}
        >
            <div 
                className="change-password-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="change-password-heading"
            >
                {/* =========================================
				    Header
				========================================= */}

                <div className="change-password-modal-header">
					<div>
						<p className="change-password-modal-eyebrow">
							Account Security
						</p>

						<h2 id="change-password-heading">
							Change Password
						</h2>

						<p>
							A verification code will be sent
							to your registered email address.
						</p>
					</div>

					<button
						type="button"
						className="change-password-modal-close"
						onClick={onClose}
						aria-label="Close password change modal"
					>
						×
					</button>
				</div>

                {/* =========================================
				    Content
				========================================= */}

                <div className="change-password-modal-content">
					<div className="change-password-field">
                        <label htmlFor="forgot-password-email">
                            Registered Email Address
                        </label>

                        <input
                            id="forgot-password-email"
                            type="email"
                            autoComplete="email"
                            placeholder="name@example.com"
                            value={emailAddress}
                            disabled={isSendingCode || codeSent}
                            onChange={(event) => {
                                setEmailAddress(event.target.value);

                                if (codeSent)
                                    setCodeSent(false);
                            }}
                        />

                        <p className="change-password-requirements">
                            Enter the email address registered to your account.
                            A six-digit verification code will be sent to this address.
                        </p>
                    </div>

					<div className="change-password-code-section">
						<div>
							<h3>Email Verification</h3>

							<p>
								Request a six-digit code before
								changing your password.
							</p>
						</div>

						<button
							type="button"
							className="settings-secondary-button"
							disabled={
                                isSendingCode ||
                                !emailAddress.trim()
                            }
							onClick={() => void handleSendCode()}
						>
							{isSendingCode
								? "Sending..."
								: codeSent
									? "Send New Code"
									: "Send Email Code"}
						</button>
					</div>

					<form
						className="change-password-form"
						onSubmit={(event) => {
							event.preventDefault();

							void handleChangePassword();
						}}
					>
						<div className="change-password-field">
							<label htmlFor="new-password">
								New Password
							</label>

							<input
								id="new-password"
								type="password"
								autoComplete="new-password"
								value={newPassword}
								onChange={(event) =>
									setNewPassword(
										event.target.value
									)
								}
							/>
						</div>

						<div className="change-password-field">
							<label htmlFor="confirm-new-password">
								Confirm New Password
							</label>

							<input
								id="confirm-new-password"
								type="password"
								autoComplete="new-password"
								value={confirmPassword}
								onChange={(event) =>
									setConfirmPassword(
										event.target.value
									)
								}
							/>

                            <p className="change-password-requirements">
                                Password must be at least 8 characters and contain 
                                at least one lowercase letter, one uppercase letter, 
                                one number, and one special character. 
                            </p>
						</div>

						<div className="change-password-field">
							<label htmlFor="verification-code">
								6-Digit Verification Code
							</label>

							<input
								id="verification-code"
								type="text"
								inputMode="numeric"
								autoComplete="one-time-code"
								maxLength={6}
								placeholder="000000"
								value={verificationCode}
								onChange={(event) => {
									const cleanCode =
										event.target.value
											.replace(/\D/g, "")
											.slice(0, 6);

									setVerificationCode(
										cleanCode
									);
								}}
							/>
						</div>

						{/* =================================
						    Messages
						================================= */}

						{error && (
							<p className="change-password-error">
								{error}
							</p>
						)}

						{success && (
							<p className="change-password-success">
								{success}
							</p>
						)}

						{/* =================================
						    Actions
						================================= */}

						<div className="change-password-actions">
							<button
								type="button"
								className="settings-secondary-button"
								disabled={isChangingPassword}
								onClick={onClose}
							>
								Cancel
							</button>

							<button
								type="submit"
								className="settings-primary-button"
								disabled={
									isChangingPassword ||
									!codeSent
								}
							>
								{isChangingPassword
									? "Changing..."
									: "Change Password"}
							</button>
						</div>
					</form>
				</div>
            </div>
        </div>
    );
}

export default ChangePasswordModalNoAuth;