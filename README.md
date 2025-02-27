# Help Desk System

A full-stack help desk ticketing system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User Authentication (Admin, Agent, Customer)
- Ticket Management
- Real-time Status Updates
- Role-based Access Control
- Dashboard Statistics
- Note System for Tickets

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd helpdesk-app
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

## Environment Setup

### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_2024
ADMIN_CODE=ADMIN123
AGENT_CODE=AGENT123
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_CODE=ADMIN123
VITE_AGENT_CODE=AGENT123
```

## Running the Application

1. Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:5000

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173

## User Roles and Access

### Admin
- View all tickets
- Manage ticket status (Active, Pending, Closed)
- View dashboard statistics
- Add notes to tickets

### Agent
- View non-closed tickets
- Update ticket status (Active, Pending, Review)
- Add notes to tickets

### Customer
- Create tickets
- View own tickets
- Add notes to own tickets
- View ticket status

## Project Structure

```
helpdesk-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── index.html
└── README.md
```

## API Endpoints

### Auth Routes
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Ticket Routes
- GET `/api/tickets/all` - Get all tickets (Admin/Agent)
- GET `/api/tickets/my` - Get user's tickets
- POST `/api/tickets` - Create new ticket
- PATCH `/api/tickets/:ticketId/status` - Update ticket status
- POST `/api/tickets/:ticketId/notes` - Add note to ticket

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **State Management**: React Context

## Development Notes

1. The backend uses MongoDB for data persistence. Make sure MongoDB is running locally or update the MONGODB_URI in .env to point to your MongoDB instance.

2. JWT is used for authentication. The JWT_SECRET in the backend .env file should be kept secure.

3. CORS is configured to allow requests from the frontend development server (http://localhost:5173).

4. The frontend uses Vite for development and building. The development server includes hot module replacement.

## Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check MONGODB_URI in backend .env

2. **CORS Error**
   - Ensure frontend URL matches CORS configuration in backend
   - Check if backend server is running

3. **Authentication Issues**
   - Verify JWT_SECRET is properly set
   - Check if token is being sent in requests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 