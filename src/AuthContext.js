import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./utils/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const { data } = await api.get("/auth/me");
    setUser(data.user);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function login() {
    const { data } = await api.get("/auth/login-url");
    window.location.href = data.url;
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
