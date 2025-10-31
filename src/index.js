import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Store from "./pages/Store"; // 💥 mağaza sayfasını ekledik

function AuthSuccess() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  useEffect(() => {
    refresh().finally(() => nav("/dashboard", { replace: true }));
  }, []);
  return null;
}

function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-3xl font-bold">Giriş hatası</h1>
        <a href="/" className="inline-block mt-6 px-4 py-2 bg-white text-black rounded-lg">
          Tekrar dene
        </a>
      </div>
    </div>
  );
}

function ThankYou() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get("session_id");
    if (session_id) {
      fetch(
        `http://localhost:5174/api/checkout/confirm?session_id=${encodeURIComponent(session_id)}`,
        { credentials: "include" }
      );
    }
  }, []);
  const params = new URLSearchParams(window.location.search);
  const bot = params.get("bot");
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-3xl font-bold">Teşekkürler!</h1>
        <p className="mt-2 text-white/80">
          Sipariş alındı {bot ? `(${bot})` : ""}. Discord’dan dönüş yapılacak.
        </p>
        <a href="/dashboard" className="inline-block mt-6 px-4 py-2 bg-white text-black rounded-lg">
          Panele Git
        </a>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/auth/error" element={<AuthError />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/store" element={<Store />} /> {/* 💥 yeni eklenen route */}
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
