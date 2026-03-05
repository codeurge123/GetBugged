import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || "https://getbugged-backend.vercel.app/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("gb_user");
    const storedToken = window.localStorage.getItem("gb_token");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setAccessToken(storedToken);
    }
    setLoading(false);
  }, []);

  const saveAuth = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    window.localStorage.setItem("gb_user", JSON.stringify(userData));
    if (token) {
      window.localStorage.setItem("gb_token", token);
    }
  };

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    window.localStorage.removeItem("gb_user");
    window.localStorage.removeItem("gb_token");
  };

  const signup = async (payload) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Signup failed");
    }
    const data = await res.json();
    saveAuth(data.user, data.accessToken);
    return data.user;
  };

  const login = async (payload) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Login failed");
    }
    const data = await res.json();
    saveAuth(data.user, data.accessToken);
    return data.user;
  };

  const refresh = async () => {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
    });
    if (!res.ok) {
      clearAuth();
      return null;
    }
    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  };

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
    }).catch(() => {});
    clearAuth();
  };

  const fetchProfile = async () => {
    if (!accessToken) return null;
    try {
      const res = await fetch(`${API_BASE}/playground/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      // merge history and all user data into user object
      setUser((u) => ({ ...u, history: data.history, debuggingStats: data.debuggingStats, testStats: data.testStats }));
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateUser = async (userData) => {
    setUser((u) => ({ ...u, ...userData }));
    window.localStorage.setItem("gb_user", JSON.stringify(userData));
    return userData;
  };

  const value = {
    user,
    accessToken,
    loading,
    signup,
    login,
    refresh,
    logout,
    fetchProfile,
    updateUser,
    apiBase: API_BASE,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

