import { useState } from "react";
import { api, isDebug } from "../lib/api.js";

const initial = isDebug
  ? {
      name: "Juan García",
      email: "juan@email.com",
      phone: "341 555-0101",
      subject: "Consulta por seguro",
      message: "Quiero recibir asesoramiento para elegir una cobertura."
    }
  : { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await api("/api/contact", { method: "POST", body: form });
      setStatus("Recibimos tu consulta. Un asesor te responderá a la brevedad.");
      if (!isDebug) setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Contacto</h1>
          <p>Dejanos tu consulta y la guardamos para que el equipo comercial pueda responder.</p>
        </div>
      </section>
      <section className="section">
        <form className="container form-card" onSubmit={submit}>
          <div className="form-grid">
            <label>Nombre<input required value={form.name} onChange={(e) => setField("name", e.target.value)} /></label>
            <label>Email<input required type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} /></label>
            <label>Teléfono<input value={form.phone} onChange={(e) => setField("phone", e.target.value)} /></label>
            <label>Asunto<input value={form.subject} onChange={(e) => setField("subject", e.target.value)} /></label>
            <label className="full">Mensaje<textarea required rows="5" value={form.message} onChange={(e) => setField("message", e.target.value)} /></label>
          </div>
          <div className="form-actions">
            <span>{status}</span>
            <button className="btn primary" disabled={loading}>{loading ? "Enviando..." : "Enviar consulta"}</button>
          </div>
        </form>
      </section>
    </main>
  );
}
