import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
	const { user } = useAuth();

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto px-4 py-16">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-900 mb-8">
						Welcome to Helpdesk Support System
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						Get help from our support team quickly and efficiently
					</p>
					{!user && (
						<div className="space-x-4">
							<Link
								to="/register"
								className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
							>
								Get Started
							</Link>
							<Link
								to="/login"
								className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700"
							>
								Sign In
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
