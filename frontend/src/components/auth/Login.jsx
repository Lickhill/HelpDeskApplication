import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		selectedRole: "customer",
		accessCode: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			// Validate access code if needed
			if (
				formData.selectedRole === "admin" ||
				formData.selectedRole === "agent"
			) {
				const expectedCode =
					formData.selectedRole === "admin"
						? import.meta.env.VITE_ADMIN_CODE
						: import.meta.env.VITE_AGENT_CODE;

				if (formData.accessCode !== expectedCode) {
					setError("Invalid access code");
					return;
				}
			}

			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/login`,
				{
					email: formData.email,
					password: formData.password,
					selectedRole: formData.selectedRole,
				}
			);

			if (response.data.token) {
				// Store token first
				localStorage.setItem("token", response.data.token);

				// Then login with user data
				login({
					...response.data,
					selectedRole: formData.selectedRole,
				});

				// Clear form data
				setFormData({
					email: "",
					password: "",
					selectedRole: "customer",
					accessCode: "",
				});

				navigate("/");
			}
		} catch (err) {
			console.error("Login error:", err);
			setError(
				err.response?.data?.message || "Login failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Help Desk System
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Sign in to your account
					</p>
				</div>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
						{error}
					</div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Email address"
							/>
						</div>
						<div>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password"
							/>
						</div>
						<div>
							<select
								name="selectedRole"
								value={formData.selectedRole}
								onChange={handleChange}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
							>
								<option value="customer">Customer</option>
								<option value="agent">
									Customer Service Agent
								</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						{(formData.selectedRole === "admin" ||
							formData.selectedRole === "agent") && (
							<div>
								<input
									type="password"
									name="accessCode"
									value={formData.accessCode}
									onChange={handleChange}
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
									placeholder="Access Code"
								/>
							</div>
						)}
					</div>

					<div className="flex items-center justify-between space-x-4">
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							{loading ? "Signing in..." : "Sign in"}
						</button>
						<Link
							to="/register"
							className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Register
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
