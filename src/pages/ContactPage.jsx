import { useState } from "react";
import { Link } from "react-router-dom";
import { api, isDebug } from "../lib/api.js";

const initial = isDebug
  ? { name: "Juan García", email: "juan@email.com", phone: "341 555-0101", subject: "Consulta por seguro", message: "Quiero recibir asesoramiento para elegir una cobertura." }
  : { name: "", email: "", phone: "", subject: "", message: "" };

const channels = [
  {
    icon: "📞",
    title: "Teléfono",
    value: "+54 341 555-0100",
    sub: "Lun–Vie 9:00 a 18:00",
    href: "tel:+543415550100",
  },
  {
    icon: "💬",
    title: "WhatsApp",
    value: "+54 9 341 555-0101",
    sub: "Respuesta en menos de 1 hora",
    href: "https://wa.me/5493415550101",
  },
  {
    icon: "📧",
    title: "Email",
    value: "contacto@segurostimbues.com",
    sub: "Te respondemos en el día",
    href: "mailto:contacto@segurostimbues.com",
  },
  {
    icon: "📍",
    title: "Oficina",
    value: "Timbúes, Santa Fe",
    sub: "Con cita previa",
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function setField(field, value) { setForm((c) => ({ ...c, [field]: value })); }

  async function submit(event) {
    event.preventDefault();
    setLoading(true); setStatus("");
    try {
      await api("/api/contact", { method: "POST", body: form });
      setSent(true);
      if (!isDebug) setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) { setStatus(error.message); }
    finally { setLoading(false); }
  }

  return (
    <main>
      {/* HERO */}
      <section className="page-hero contact-hero">
        <div className="container text-center">
          <h1>¿Cómo podemos ayudarte?</h1>
          <p>Estamos disponibles para asesorarte en coberturas, siniestros o cualquier consulta.</p>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="contact-channels-section">
        <div className="container">
          <div className="contact-channels-grid">
            {channels.map((ch) => (
              <div key={ch.title} className="contact-channel-card">
                <div className="contact-channel-icon">{ch.icon}</div>
                <div className="contact-channel-body">
                  <strong>{ch.title}</strong>
                  {ch.href ? (
                    <a href={ch.href} className="contact-channel-value" target={ch.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {ch.value}
                    </a>
                  ) : (
                    <span className="contact-channel-value">{ch.value}</span>
                  )}
                  <span className="contact-channel-sub">{ch.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout">

            {/* SIDEBAR */}
            <aside className="contact-sidebar">
              <div className="contact-sidebar-inner">
                <h2>Hablá con un asesor</h2>
                <p>Nuestro equipo te acompaña para encontrar la cobertura ideal. Sin tecnicismos, sin presión.</p>

                <div className="contact-sidebar-list">
                  <div className="contact-sidebar-item">
                    <span className="contact-sidebar-bullet">✓</span>
                    <span>Asesoramiento sin costo</span>
                  </div>
                  <div className="contact-sidebar-item">
                    <span className="contact-sidebar-bullet">✓</span>
                    <span>Cotizamos en el día</span>
                  </div>
                  <div className="contact-sidebar-item">
                    <span className="contact-sidebar-bullet">✓</span>
                    <span>Cobertura para todo el país</span>
                  </div>
                  <div className="contact-sidebar-item">
                    <span className="contact-sidebar-bullet">✓</span>
                    <span>Acompañamiento ante siniestros</span>
                  </div>
                </div>

                <div className="contact-sidebar-divider" />

                <p className="contact-sidebar-cta-text">¿Preferís cotizar directamente?</p>
                <Link className="btn btn-green btn-full" to="/cotizar">Ir al cotizador</Link>

                <div className="contact-sidebar-social">
                  <a href="https://wa.me/5493415550101" className="contact-social-btn" target="_blank" rel="noopener noreferrer">
                    <span>💬</span> WhatsApp
                  </a>
                  <a href="https://instagram.com" className="contact-social-btn" target="_blank" rel="noopener noreferrer">
                    <span>📸</span> Instagram
                  </a>
                </div>
              </div>
            </aside>

            {/* FORM */}
            <div className="contact-form-card">
              {sent ? (
                <div className="contact-success">
                  <div className="contact-success-icon">✅</div>
                  <h3>¡Mensaje enviado!</h3>
                  <p>Recibimos tu consulta. Un asesor te responderá a la brevedad en el email o teléfono que indicaste.</p>
                  <button className="btn btn-outline" onClick={() => setSent(false)}>Enviar otro mensaje</button>
                </div>
              ) : (
                <>
                  <div className="contact-form-header">
                    <h2>Envianos tu consulta</h2>
                    <p>Completá el formulario y te contactamos en el día.</p>
                  </div>
                  <form onSubmit={submit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="name">Nombre completo *</label>
                        <input id="name" required placeholder="Ej: Juan García" value={form.name} onChange={(e) => setField("name", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input id="email" required type="email" placeholder="tu@email.com" value={form.email} onChange={(e) => setField("email", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Teléfono</label>
                        <input id="phone" placeholder="+54 341 ..." value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject">Asunto</label>
                        <input id="subject" placeholder="Ej: Cotización seguro auto" value={form.subject} onChange={(e) => setField("subject", e.target.value)} />
                      </div>
                      <div className="form-group form-group-full">
                        <label htmlFor="message">Mensaje *</label>
                        <textarea id="message" required rows="5" placeholder="Contanos en qué podemos ayudarte..." value={form.message} onChange={(e) => setField("message", e.target.value)} />
                      </div>
                    </div>
                    {status && <p className="contact-form-error">{status}</p>}
                    <div className="contact-form-footer">
                      <p className="contact-form-note">🔒 Tu información está segura. No compartimos tus datos.</p>
                      <button className="btn btn-green btn-lg" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar mensaje →"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
