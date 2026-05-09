/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, login as loginRequest, register as registerRequest } from "../api/authApi";
import { setUnauthorizedHandler } from "../api/axiosConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("eventify_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("eventify_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authReady, setAuthReady] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("eventify_token");
    localStorage.removeItem("eventify_user");
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  useEffect(() => {
    let active = true;
    const hydrateUser = async () => {
      if (!token) {
        setAuthReady(true);
        return;
      }
      try {
        const profile = await getMe();
        if (active && profile) {
          setUser(profile);
          localStorage.setItem("eventify_user", JSON.stringify(profile));
        }
      } finally {
        if (active) setAuthReady(true);
      }
    };
    hydrateUser();
    return () => {
      active = false;
    };
  }, [token]);

  const login = async (credentials) => {
    const result = await loginRequest(credentials);
    localStorage.setItem("eventify_token", result.token);
    localStorage.setItem("eventify_user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result.user;
  };

  const register = (payload) => registerRequest(payload);

  const value = useMemo(
    () => ({
      token,
      user,
      authReady,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout
    }),
    [token, user, authReady, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
