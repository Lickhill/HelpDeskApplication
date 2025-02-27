import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
	const { user } = useAuth();

	return (
		<div className="fixed left-0 top-16 w-64 h-full bg-gray-800 text-white p-6">
			<nav className="space-y-4">
				<Link
					to="/"
					className="block py-2.5 px-4 rounded hover:bg-gray-700"
				>
					Dashboard
				</Link>

				{/* Show "All Tickets" only for admin and agent */}
				{(user.role === "admin" || user.role === "agent") && (
					<Link
						to="/tickets/all"
						className="block py-2.5 px-4 rounded hover:bg-gray-700"
					>
						All Tickets
					</Link>
				)}

				{/* Show "Submit Ticket" only for customers */}
				{user.role === "customer" && (
					<Link
						to="/tickets/new"
						className="block py-2.5 px-4 rounded hover:bg-gray-700"
					>
						Submit Ticket
					</Link>
				)}

				<Link
					to="/tickets/my"
					className="block py-2.5 px-4 rounded hover:bg-gray-700"
				>
					My Tickets
				</Link>
			</nav>
		</div>
	);
};

export default Sidebar;
