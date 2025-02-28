import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const DashboardStats = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { user } = useAuth();

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/dashboard/stats`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				setStats(response.data.data);
			}
		} catch (err) {
			setError(
				err.response?.data?.message ||
					"Failed to load dashboard statistics"
			);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Loading stats...</div>;
	if (error) return <div className="text-red-600">{error}</div>;
	if (!stats) return null;

	const renderStats = () => {
		switch (user.role) {
			case "admin":
				return (
					<>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Active Tickets
							</h3>
							<p className="text-3xl font-bold text-green-600">
								{stats.tickets.Active}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Pending Tickets
							</h3>
							<p className="text-3xl font-bold text-yellow-600">
								{stats.tickets.Pending}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Closed Tickets
							</h3>
							<p className="text-3xl font-bold text-red-600">
								{stats.tickets.Closed}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Total Users
							</h3>
							<p className="text-3xl font-bold text-blue-600">
								{stats.users}
							</p>
						</div>
					</>
				);
			case "agent":
				return (
					<>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Active Tickets
							</h3>
							<p className="text-3xl font-bold text-green-600">
								{stats.tickets.Active}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Pending Tickets
							</h3>
							<p className="text-3xl font-bold text-yellow-600">
								{stats.tickets.Pending}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Review Tickets
							</h3>
							<p className="text-3xl font-bold text-blue-600">
								{stats.tickets.Review}
							</p>
						</div>
					</>
				);
			default: // customer
				return (
					<>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Active Tickets
							</h3>
							<p className="text-3xl font-bold text-green-600">
								{stats.tickets.Active}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Pending Tickets
							</h3>
							<p className="text-3xl font-bold text-yellow-600">
								{stats.tickets.Pending}
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Closed Tickets
							</h3>
							<p className="text-3xl font-bold text-red-600">
								{stats.tickets.Closed}
							</p>
						</div>
					</>
				);
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			{renderStats()}
		</div>
	);
};

export default DashboardStats;
