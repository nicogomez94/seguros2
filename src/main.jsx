import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import QuotePage from "./pages/QuotePage.jsx";
import StaticPage from "./pages/StaticPage.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre-nosotros" element={<StaticPage type="about" />} />
          <Route path="/servicios" element={<StaticPage type="services" />} />
          <Route path="/blog" element={<StaticPage type="blog" />} />
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
