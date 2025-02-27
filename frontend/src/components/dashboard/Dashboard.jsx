import { useAuth } from "../../context/AuthContext";
import DashboardStats from "./DashboardStats";

const Dashboard = () => {
	const { user } = useAuth();

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">
				{user?.role === "admin"
					? "Admin Dashboard"
					: user?.role === "agent"
					? "Agent Dashboard"
					: "My Dashboard"}
			</h1>

			<DashboardStats />

			{/* Other dashboard content */}
		</div>
	);
};

export default Dashboard;
