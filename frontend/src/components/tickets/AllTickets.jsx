import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import TicketRow from "./TicketRow";

const AllTickets = () => {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { user } = useAuth();

	useEffect(() => {
		fetchAllTickets();
	}, []);

	const sortTickets = (ticketsArray) => {
		return [...ticketsArray].sort((a, b) => {
			// Put Closed/Review tickets at the end
			if (a.status === "Closed" && b.status !== "Closed") return 1;
			if (a.status !== "Closed" && b.status === "Closed") return -1;
			if (a.status === "Review" && b.status !== "Review") return 1;
			if (a.status !== "Review" && b.status === "Review") return -1;

			// For other tickets, sort by updatedAt
			return new Date(b.updatedAt) - new Date(a.updatedAt);
		});
	};

	const fetchAllTickets = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/tickets/all`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				setTickets(sortTickets(response.data.data));
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load tickets");
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (ticketId, newStatus) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.patch(
				`${import.meta.env.VITE_API_URL}/tickets/${ticketId}/status`,
				{ status: newStatus },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				// Update tickets and apply sorting
				const updatedTickets = tickets.map((ticket) =>
					ticket._id === ticketId
						? { ...ticket, status: newStatus }
						: ticket
				);
				setTickets(sortTickets(updatedTickets));
			}
		} catch (err) {
			console.error("Error updating status:", err);
			setError("Failed to update ticket status");
		}
	};

	const handleAddNote = async (ticketId, noteText) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/tickets/${ticketId}/notes`,
				{ text: noteText },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.success) {
				setTickets(
					tickets.map((ticket) =>
						ticket._id === ticketId
							? {
									...ticket,
									notes: [
										...ticket.notes,
										{
											...response.data.note,
											addedAt: new Date(
												response.data.note.addedAt
											).toISOString(),
										},
									],
							  }
							: ticket
					)
				);
			}
		} catch (err) {
			console.error("Error adding note:", err);
			setError(
				err.response?.data?.message ||
					err.response?.data?.error ||
					"Failed to add note"
			);
		}
	};

	const getStatusOptions = () => {
		if (user.role === "admin") {
			return ["Active", "Pending", "Closed"];
		} else if (user.role === "agent") {
			return ["Active", "Pending", "Review"];
		}
		return [];
	};

	if (loading) return <div>Loading tickets...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="container mx-auto p-6">
			<h2 className="text-2xl font-bold mb-6">All Tickets</h2>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Ticket ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Title
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Customer
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Last Updated
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{tickets.map((ticket) => (
							<TicketRow
								key={ticket._id}
								ticket={ticket}
								onStatusChange={handleStatusChange}
								onAddNote={handleAddNote}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AllTickets;
