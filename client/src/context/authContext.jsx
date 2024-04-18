import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const storedUser = localStorage.getItem("user");

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            if (!storedUser) {
                return null;
            }
            return JSON.parse(storedUser);
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            return null;
        }
    });

    const login = async (inputs) => {
        const res = await axios.post("http://localhost:5173/api/auth/login", inputs);
        setCurrentUser({
            id: res.data.id,
            username: res.data.username,
        });
    }

    const logout = async () => {
        try {
            await axios.post("http://localhost:5173/api/auth/logout");
            localStorage.removeItem("user");
            setCurrentUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("user", JSON.stringify(currentUser));
        }
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
