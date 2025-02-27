import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/register`,
				formData
			);

			if (response.data.message === "Registration successful") {
				navigate("/login");
			}
		} catch (err) {
			console.error("Registration error:", err);
			setError(
				err.response?.data?.message ||
					"Registration failed. Please try again."
			);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
				<h2 className="text-3xl font-bold text-center">
					Create Account
				</h2>
				{error && (
					<div className="bg-red-100 text-red-700 p-3 rounded">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
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
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Register
					</button>
				</form>
			</div>
		</div>
	);
};

export default Register;
