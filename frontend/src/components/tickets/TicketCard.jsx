import { useState } from "react";
import PropTypes from "prop-types";

const TicketCard = ({ ticket, onAddNote, onDelete }) => {
	const [isAddingNote, setIsAddingNote] = useState(false);
	const [noteText, setNoteText] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [showNotes, setShowNotes] = useState(false);

	const formatDateTime = (dateString) => {
		const date = new Date(dateString);
		const formattedDate = date.toLocaleDateString();
		const formattedTime = date.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});
		return `${formattedDate} ${formattedTime}`;
	};

	const handleSubmitNote = (e) => {
		e.preventDefault();
		if (noteText.trim()) {
			onAddNote(ticket._id, noteText);
			setNoteText("");
			setIsAddingNote(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this ticket?")) {
			setIsDeleting(true);
			try {
				await onDelete(ticket._id);
			} finally {
				setIsDeleting(false);
			}
		}
	};

	const getNoteTypeColor = (noteType) => {
		switch (noteType) {
			case "admin":
				return "bg-purple-50 border-l-4 border-purple-500";
			case "agent":
				return "bg-blue-50 border-l-4 border-blue-500";
			default:
				return "bg-gray-50 border-l-4 border-gray-500";
		}
	};

	const getNoteTypeLabel = (noteType) => {
		switch (noteType) {
			case "admin":
				return "Admin";
			case "agent":
				return "Agent";
			default:
				return "Customer";
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="text-xl font-semibold">{ticket.title}</h3>
					<p className="text-gray-600 text-sm">
						Ticket ID: {ticket.ticketId}
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<span
						className={`px-3 py-1 rounded-full text-sm ${
							ticket.status === "Active"
								? "bg-green-100 text-green-800"
								: ticket.status === "Pending"
								? "bg-yellow-100 text-yellow-800"
								: ticket.status === "Review"
								? "bg-blue-100 text-blue-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{ticket.status}
					</span>
					<button
						onClick={handleDelete}
						disabled={isDeleting}
						className={`px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 ${
							isDeleting ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			</div>

			<p className="text-gray-700 mb-4">{ticket.description}</p>

			<div className="flex justify-end mb-4">
				<button
					onClick={() => setShowNotes(!showNotes)}
					className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
				>
					<span className="mr-2">Notes</span>
					<span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
						{ticket.notes.length}
					</span>
				</button>
			</div>

			{showNotes && (
				<div className="border-t pt-4">
					<div className="flex justify-between items-center mb-4">
						<h4 className="text-lg font-semibold">Notes</h4>
						<button
							onClick={() => setIsAddingNote(!isAddingNote)}
							className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							{isAddingNote ? "Cancel" : "Add Note"}
						</button>
					</div>

					{isAddingNote && (
						<form onSubmit={handleSubmitNote} className="mb-4">
							<textarea
								value={noteText}
								onChange={(e) => setNoteText(e.target.value)}
								className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
								rows="3"
								placeholder="Enter your note..."
								required
							/>
							<button
								type="submit"
								className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
							>
								Add
							</button>
						</form>
					)}

					<div className="space-y-3">
						{ticket.notes.map((note, index) => (
							<div
								key={index}
								className={`p-3 rounded-md ${getNoteTypeColor(
									note.noteType
								)}`}
							>
								<p className="text-gray-700">{note.text}</p>
								<div className="flex justify-between items-center mt-2 text-sm text-gray-500">
									<div className="flex items-center space-x-2">
										<span>
											By:{" "}
											{note.addedBy?.name ||
												note.addedBy?.email ||
												"Unknown"}
										</span>
										<span className="px-2 py-1 rounded-full bg-gray-200 text-xs">
											{getNoteTypeLabel(note.noteType)}
										</span>
									</div>
									<span>{formatDateTime(note.addedAt)}</span>
								</div>
							</div>
						))}
						{ticket.notes.length === 0 && (
							<p className="text-gray-500 text-center py-4">
								No notes yet
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

TicketCard.propTypes = {
	ticket: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		ticketId: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired,
		notes: PropTypes.arrayOf(
			PropTypes.shape({
				text: PropTypes.string.isRequired,
				addedBy: PropTypes.shape({
					name: PropTypes.string,
					email: PropTypes.string,
				}),
				addedAt: PropTypes.string.isRequired,
				noteType: PropTypes.oneOf(["customer", "admin", "agent"])
					.isRequired,
			})
		).isRequired,
	}).isRequired,
	onAddNote: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default TicketCard;
