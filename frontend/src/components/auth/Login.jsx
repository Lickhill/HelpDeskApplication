import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
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
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
				<h2 className="text-3xl font-bold text-center">Sign In</h2>
				{error && (
					<div className="bg-red-100 text-red-700 p-3 rounded">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Login As
						</label>
						<select
							name="selectedRole"
							value={formData.selectedRole}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
							<label className="block text-sm font-medium text-gray-700">
								Access Code
							</label>
							<input
								type="password"
								name="accessCode"
								value={formData.accessCode}
								onChange={handleChange}
								required
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					)}
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
