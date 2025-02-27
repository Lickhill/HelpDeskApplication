import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import TicketCard from "./TicketCard";

const MyTickets = () => {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { user } = useAuth();

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/tickets/my`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				setTickets(response.data.data);
			}
		} catch (err) {
			console.error("Error fetching tickets:", err);
			setError("Failed to load tickets");
		} finally {
			setLoading(false);
		}
	};

	const handleAddNote = async (ticketId, noteText) => {
		try {
			const token = localStorage.getItem("token");
			console.log("Adding note:", { ticketId, noteText }); // Debug log

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

			console.log("Note response:", response.data); // Debug log

			if (response.data.success) {
				// Update tickets list with new note
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
				setError(""); // Clear any existing error
			}
		} catch (err) {
			console.error("Error adding note:", err);
			console.error("Error response:", err.response?.data); // Log the error response
			setError(
				err.response?.data?.message ||
					err.response?.data?.error ||
					"Failed to add note"
			);
		}
	};

	const handleDeleteTicket = async (ticketId) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.delete(
				`${import.meta.env.VITE_API_URL}/tickets/${ticketId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				// Remove the deleted ticket from state
				setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
			}
		} catch (err) {
			console.error("Error deleting ticket:", err);
			setError("Failed to delete ticket");
		}
	};

	if (loading) return <div>Loading tickets...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="container mx-auto p-6">
			<h2 className="text-2xl font-bold mb-6">My Tickets</h2>
			<div className="space-y-6">
				{tickets.length === 0 ? (
					<p>No tickets found.</p>
				) : (
					tickets.map((ticket) => (
						<TicketCard
							key={ticket._id}
							ticket={ticket}
							onAddNote={handleAddNote}
							onDelete={handleDeleteTicket}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default MyTickets;
