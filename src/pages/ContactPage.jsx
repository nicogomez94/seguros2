import { useState } from "react";
import { api, isDebug } from "../lib/api.js";

const initial = isDebug
  ? { name: "Juan García", email: "juan@email.com", phone: "341 555-0101", subject: "Consulta por seguro", message: "Quiero recibir asesoramiento para elegir una cobertura." }
  : { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(field, value) { setForm((c) => ({ ...c, [field]: value })); }

  async function submit(event) {
    event.preventDefault();
    setLoading(true); setStatus("");
    try {
      await api("/api/contact", { method: "POST", body: form });
      setStatus("Recibimos tu consulta. Un asesor te responderá a la brevedad.");
      if (!isDebug) setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) { setStatus(error.message); }
    finally { setLoading(false); }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container text-center">
          <h1>Contacto</h1>
          <p>Dejanos tu consulta y un asesor te responderá a la brevedad.</p>
        </div>
      </section>

      <section className="form-section">
        <div className="container form-container">
          <h2>Envianos un mensaje</h2>
          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nombre *</label>
                <input id="name" required value={form.name} onChange={(e) => setField("name", e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input id="email" required type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input id="phone" value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Asunto</label>
                <input id="subject" value={form.subject} onChange={(e) => setField("subject", e.target.value)} />
              </div>
              <div className="form-group form-group-full">
                <label htmlFor="message">Mensaje *</label>
                <textarea id="message" required rows="5" value={form.message} onChange={(e) => setField("message", e.target.value)} />
              </div>
            </div>
            <div className="form-actions">
              <span style={{ color: "var(--text-muted)" }}>{status}</span>
              <button className="btn btn-green btn-lg" disabled={loading}>
                {loading ? "Enviando..." : "Enviar consulta"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
