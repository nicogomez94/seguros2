import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, isDebug } from "../lib/api.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: isDebug ? "admin@segurostimbues.com.ar" : "",
    password: isDebug ? "Admin123!" : ""
  });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await api("/api/auth/login", { method: "POST", body: form });
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <Link className="nav-logo" to="/" style={{ fontSize: "1.15rem", textDecoration: "none" }}>
          <span className="logo-icon">🦅</span> Seguros Timbúes
        </Link>
        <h1>Panel admin</h1>
        <label>
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Contraseña
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {error && <p className="alert">{error}</p>}
        <button className="btn btn-green btn-full">Ingresar</button>
      </form>
    </main>
  );
}
