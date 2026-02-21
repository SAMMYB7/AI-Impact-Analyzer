// ═══════════════════════════════════════════════════════════════
// AUTH CONTEXT — Manages user authentication state globally
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
    const [loading, setLoading] = useState(true);

    // Set/clear the Authorization header whenever token changes
    useEffect(() => {
        if (token) {
            API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("auth_token", token);
        } else {
            delete API.defaults.headers.common["Authorization"];
            localStorage.removeItem("auth_token");
        }
    }, [token]);

    // On mount, verify stored token and fetch user profile
    useEffect(() => {
        async function loadUser() {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await API.get("/api/auth/me");
                setUser(res.data.user);
            } catch (error) {
                console.error("Auth check failed:", error);
                // Token invalid or expired — clear it
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [token]);

    // ── Login ────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        const res = await API.post("/api/auth/login", { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    }, []);

    // ── Register Step 1: Request OTP ─────────────────────────
    const register = useCallback(async (name, email, password) => {
        const res = await API.post("/api/auth/register", { name, email, password });
        return res.data; // Note: doesn't set token/user yet
    }, []);

    // ── Register Step 2: Verify OTP ──────────────────────────
    const verifyOTP = useCallback(async (email, otp) => {
        const res = await API.post("/api/auth/verify-otp", { email, otp });
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    }, []);

    // ── Register Step 3: Resend OTP ──────────────────────────
    const resendOTP = useCallback(async (email) => {
        const res = await API.post("/api/auth/resend-otp", { email });
        return res.data;
    }, []);

    // ── GitHub OAuth ─────────────────────────────────────────
    const loginWithGithub = useCallback(async (code) => {
        const res = await API.post("/api/auth/github", { code });
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    }, []);

    // ── Logout ───────────────────────────────────────────────
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
    }, []);

    // ── Update Profile ───────────────────────────────────────
    const updateProfile = useCallback(async (data) => {
        const res = await API.put("/api/auth/profile", data);
        setUser(res.data.user);
        return res.data;
    }, []);

    // ── Update Password ──────────────────────────────────────
    const updatePassword = useCallback(async (currentPassword, newPassword) => {
        const res = await API.put("/api/auth/password", { currentPassword, newPassword });
        return res.data;
    }, []);

    // ── Connect GitHub ───────────────────────────────────────
    const connectGithub = useCallback(async (code) => {
        const res = await API.post("/api/auth/connect-github", { code });
        setUser(res.data.user);
        return res.data;
    }, []);

    // ── Disconnect GitHub ────────────────────────────────────
    const disconnectGithub = useCallback(async () => {
        const res = await API.delete("/api/auth/disconnect-github");
        setUser(res.data.user);
        return res.data;
    }, []);

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        verifyOTP,
        resendOTP,
        loginWithGithub,
        logout,
        updateProfile,
        updatePassword,
        connectGithub,
        disconnectGithub,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
