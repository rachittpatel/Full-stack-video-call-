

import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext();

const client = axios.create({
    baseURL: `${server}/api/v1/users`
});

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            const response = await client.post("/register", {
                name,
                username,
                password
            });

            if (response.status === httpStatus.CREATED) {
                return response.data.message;
            }
        } catch (err) {
            console.error("Registration error:", err);
            throw err.response?.data?.message || "Registration failed";
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await client.post("/login", {
                username,
                password
            });

            if (response.status === httpStatus.OK) {
                localStorage.setItem("token", response.data.token);
                setUserData(response.data.user); // Assuming response contains user data
                navigate("/home");
            }
        } catch (err) {
            console.error("Login error:", err);
            throw err.response?.data?.message || "Login failed";
        }
    };

    const getHistoryOfUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");
            
            const response = await client.get("/get_all_activity", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            console.error("History fetch error:", err);
            throw err.response?.data?.message || "Failed to fetch history";
        }
    };

    const addToUserHistory = async (meetingCode) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");
            
            const response = await client.post("/add_to_activity", {
                meeting_code: meetingCode
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            console.error("Add history error:", err);
            throw err.response?.data?.message || "Failed to add to history";
        }
    };

    const value = {
        userData,
        setUserData,
        addToUserHistory,
        getHistoryOfUser,
        handleRegister,
        handleLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
