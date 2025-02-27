import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import SubmitTicket from "./components/tickets/SubmitTicket";
import MyTickets from "./components/tickets/MyTickets";
import AllTickets from "./components/tickets/AllTickets";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/" element={<Layout />}>
						<Route index element={<Dashboard />} />
						<Route path="tickets/new" element={<SubmitTicket />} />
						<Route path="tickets/my" element={<MyTickets />} />
						<Route path="tickets/all" element={<AllTickets />} />
					</Route>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
