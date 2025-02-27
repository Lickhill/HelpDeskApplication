import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";

const TicketRow = ({ ticket, onStatusChange, onAddNote }) => {
	const [showNotes, setShowNotes] = useState(false);
	const [isAddingNote, setIsAddingNote] = useState(false);
	const [noteText, setNoteText] = useState("");
	const { user } = useAuth();

	const getAllowedStatuses = () => {
		switch (user.role) {
			case "admin":
				return ["Active", "Pending", "Closed"]; // Admin can't set Review
			case "agent":
				return ["Active", "Pending", "Review"]; // Agent can't set Closed
			default:
				return [];
		}
	};

	const handleSubmitNote = (e) => {
		e.preventDefault();
		if (noteText.trim()) {
			onAddNote(ticket._id, noteText);
			setNoteText("");
			setIsAddingNote(false);
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

	return (
		<>
			<tr className="hover:bg-gray-50">
				<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
					{ticket.ticketId}
				</td>
				<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
					{ticket.title}
				</td>
				<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
					{ticket.customerName}
				</td>
				<td className="px-6 py-4 whitespace-nowrap">
					<select
						value={ticket.status}
						onChange={(e) =>
							onStatusChange(ticket._id, e.target.value)
						}
						className={`rounded-full px-3 py-1 text-sm font-semibold ${
							ticket.status === "Active"
								? "bg-green-100 text-green-800"
								: ticket.status === "Pending"
								? "bg-yellow-100 text-yellow-800"
								: ticket.status === "Review"
								? "bg-blue-100 text-blue-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{getAllowedStatuses().map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</td>
				<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
					{new Date(ticket.updatedAt).toLocaleDateString()}
				</td>
				<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
					<button
						onClick={() => setShowNotes(!showNotes)}
						className="text-blue-600 hover:text-blue-900 flex items-center"
					>
						Notes
						<span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-xs">
							{ticket.notes.length}
						</span>
					</button>
				</td>
			</tr>
			{showNotes && (
				<tr>
					<td colSpan="6" className="px-6 py-4 bg-gray-50">
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h4 className="text-lg font-semibold">Notes</h4>
								<button
									onClick={() =>
										setIsAddingNote(!isAddingNote)
									}
									className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
								>
									{isAddingNote ? "Cancel" : "Add Note"}
								</button>
							</div>

							{isAddingNote && (
								<form
									onSubmit={handleSubmitNote}
									className="space-y-2"
								>
									<textarea
										value={noteText}
										onChange={(e) =>
											setNoteText(e.target.value)
										}
										className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
										rows="3"
										placeholder="Enter your note..."
										required
									/>
									<button
										type="submit"
										className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
										<p className="text-gray-700">
											{note.text}
										</p>
										<div className="flex justify-between items-center mt-2 text-sm text-gray-500">
											<div className="flex items-center space-x-2">
												<span>
													By:{" "}
													{note.addedBy?.name ||
														note.addedBy?.email ||
														"Unknown"}
												</span>
												<span className="px-2 py-1 rounded-full bg-gray-200 text-xs">
													{getNoteTypeLabel(
														note.noteType
													)}
												</span>
											</div>
											<span>
												{formatDateTime(note.addedAt)}
											</span>
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
					</td>
				</tr>
			)}
		</>
	);
};

TicketRow.propTypes = {
	ticket: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		ticketId: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		customerName: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired,
		updatedAt: PropTypes.string.isRequired,
		notes: PropTypes.arrayOf(
			PropTypes.shape({
				text: PropTypes.string.isRequired,
				addedBy: PropTypes.shape({
					name: PropTypes.string,
				}),
				addedAt: PropTypes.string.isRequired,
				noteType: PropTypes.oneOf(["customer", "admin", "agent"])
					.isRequired,
			})
		).isRequired,
	}).isRequired,
	onStatusChange: PropTypes.func.isRequired,
	onAddNote: PropTypes.func.isRequired,
};

export default TicketRow;
