import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import QuotePage from "./pages/QuotePage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import "./styles.css";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/cotizar" element={<QuotePage />} />
        </Route>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
