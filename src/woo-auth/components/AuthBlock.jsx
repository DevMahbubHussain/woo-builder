import apiFetch from "@wordpress/api-fetch";
import React, { useState, useEffect } from "react";

apiFetch.use((options, next) => {
	options.credentials = "same-origin";
	return next(options);
});

const AuthBlock = ({ redirectUrl, onSuccess }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await apiFetch({
				path: isLogin ? "/shaped-auth/v1/login" : "/shaped-auth/v1/register",
				method: "POST",
				data: isLogin ? { email, password } : { email, password, username },
			});

			if (response.success && response.redirect) {
				 window.location.href = response.redirect;
			}
		} catch (err) {
			setError(err.message || "Authentication failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-block">
			<div className="auth-tabs">
				<button
					onClick={() => setIsLogin(true)}
					className={isLogin ? "active" : ""}
				>
					Login
				</button>
				<button
					onClick={() => setIsLogin(false)}
					className={!isLogin ? "active" : ""}
				>
					Register
				</button>
			</div>

			<form onSubmit={handleSubmit}>
				{!isLogin && (
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				)}

				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				{error && <div className="auth-error">{error}</div>}

				<button type="submit" disabled={loading}>
					{loading ? "Please wait..." : isLogin ? "Login" : "Register"}
				</button>
			</form>
		</div>
	);
};

export default AuthBlock;
