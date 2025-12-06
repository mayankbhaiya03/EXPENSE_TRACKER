import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../utils/api.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// small JWT decode helper function
const decodeToken = (token) => {
    try {
        const payload = token.split(".")[1];
        const json = decodeURIComponent(
            Array.prototype.map
                .call(atob(payload.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
                    "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        const decoded = decodeToken(token);
        if (decoded) setUser({ id: decoded.id, name: decoded.name, email: decoded.email });
        else localStorage.removeItem("token");
        setLoading(false);
    }, []);

    const signup = async ({ name, email, password }) => {
        const data = await apiFetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });
        localStorage.setItem("token", data.token);
        setUser(data.user || decodeToken(data.token) || null);
        return data;
    };

    const login = async ({ email, password }) => {
        const data = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        localStorage.setItem("token", data.token);
        setUser(data.user || decodeToken(data.token) || null);
        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
