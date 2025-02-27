import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="bg-gray-800 fixed w-full z-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<Link to="/" className="flex items-center">
							<h1 className="text-white text-xl font-bold cursor-pointer">
								Help Desk System
							</h1>
						</Link>
					</div>

					<div className="flex items-center">
						<div className="flex items-center space-x-4">
							<span className="text-gray-300 mr-4">
								{user?.name} ({user?.role})
							</span>
							<button
								onClick={handleLogout}
								className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
