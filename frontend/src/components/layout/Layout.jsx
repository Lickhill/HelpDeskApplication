import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />
			<div className="flex">
				<Sidebar />
				<main className="flex-1 ml-64 p-6 mt-16">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
