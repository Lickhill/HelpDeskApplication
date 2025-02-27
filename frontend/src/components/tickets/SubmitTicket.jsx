import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const SubmitTicket = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");
		setSuccess("");

		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/tickets`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.success) {
				setSuccess("Ticket submitted successfully!");
				// Reset form
				setFormData({
					title: "",
					description: "",
				});
				// Redirect after 2 seconds
				setTimeout(() => {
					navigate("/tickets/my");
				}, 2000);
			}
		} catch (err) {
			console.error("Submit ticket error:", err);
			setError(
				err.response?.data?.message ||
					"Failed to submit ticket. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-6">Submit New Ticket</h2>

			{error && (
				<div className="bg-red-100 text-red-700 p-3 rounded mb-4">
					{error}
				</div>
			)}
			{success && (
				<div className="bg-green-100 text-green-700 p-3 rounded mb-4">
					{success}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<input
						type="text"
						value={user?.name || ""}
						readOnly
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						type="email"
						value={user?.email || ""}
						readOnly
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Title
					</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="Brief description of your issue"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Description
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						required
						rows={4}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="Please provide detailed information about your issue"
					></textarea>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
						isSubmitting
							? "bg-blue-400 cursor-not-allowed"
							: "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					}`}
				>
					{isSubmitting ? "Submitting..." : "Submit Ticket"}
				</button>
			</form>
		</div>
	);
};

export default SubmitTicket;
