import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./utils/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcıyı yenile
  async function refresh() {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (err) {
      console.error("Kullanıcı bilgisi alınamadı:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  // Discord ile giriş başlat
  async function login() {
    try {
      const { data } = await api.get("/auth/login-url");
      // URL doğrudan backend’den gelir (redirect_uri zaten doğru olur)
      window.location.href = data.url;
    } catch (err) {
      console.error("Giriş başlatılamadı:", err);
      alert("Giriş sırasında hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  }

  // Oturumu kapat
  async function logout() {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Çıkış başarısız:", err);
    }
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
