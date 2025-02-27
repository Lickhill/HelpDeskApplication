import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("user");
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const login = (userData) => {
		// Store both user data and token
		const userWithRole = {
			...userData.user,
			role: userData.user.role || userData.selectedRole,
		};
		setUser(userWithRole);
		localStorage.setItem("user", JSON.stringify(userWithRole));
		localStorage.setItem("token", userData.token); // Store token
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
