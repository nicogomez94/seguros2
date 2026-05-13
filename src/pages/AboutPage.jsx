import { Link } from "react-router-dom";

const values = [
  { icon: "🤝", title: "Asesoramiento real", desc: "Te explicamos cada cobertura sin tecnicismos, para que puedas elegir con información clara y sin presión." },
  { icon: "⚡", title: "Respuesta rápida", desc: "Cotizamos en el día. Ante un siniestro, estamos disponibles para acompañarte desde el primer momento." },
  { icon: "🗺️", title: "Alcance nacional", desc: "Operamos en todo el país. Podés contratar y gestionar tu seguro sin importar dónde estés." },
  { icon: "🔒", title: "Confianza y transparencia", desc: "Trabajamos con las aseguradoras líderes del mercado y te mantenemos informado en cada etapa." },
];

export default function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="page-hero">
        <div className="container text-center">
          <h1>Sobre nosotros</h1>
          <p>Somos un equipo de asesores dedicados a proteger lo que más importa, con claridad y compromiso.</p>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section style={{ padding: "72px 0", background: "#fff" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "20px", lineHeight: 1.2 }}>
                Protegemos lo que construiste con esfuerzo
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "16px", fontSize: "1.05rem" }}>
                Seguros Timbúes nació con el objetivo de acercar el asesoramiento en seguros a personas, familias y
                comercios de todo el país. Creemos que contratar un seguro no debería ser complicado ni confuso.
              </p>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "32px", fontSize: "1.05rem" }}>
                Trabajamos con las principales aseguradoras del mercado argentino para ofrecerte opciones reales,
                adaptadas a tu situación y presupuesto. Nuestro compromiso es estar presentes antes, durante y
                después de cada contratación.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link className="btn btn-green" to="/cotizar">Solicitar cotización</Link>
                <Link className="btn btn-outline" to="/contacto">Contactar un asesor</Link>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80"
                alt="Equipo de asesores"
                style={{ width: "100%", height: "400px", objectFit: "cover", objectPosition: "center", borderRadius: "var(--radius-lg)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section style={{ padding: "72px 0", background: "var(--gray-bg)" }}>
        <div className="container">
          <h2 className="text-center" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
            Nuestros valores
          </h2>
          <p className="text-center subtitle">Lo que nos guía en cada decisión y en cada cliente.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginTop: "40px" }}>
            {values.map((v) => (
              <div key={v.title} className="stat-item" style={{ padding: "32px 24px", textAlign: "left" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "14px" }}>{v.icon}</div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "10px" }}>{v.title}</h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">😊</div>
              <div className="stat-number">+1000</div>
              <div className="stat-label">Clientes satisfechos</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🗺️</div>
              <div className="stat-number">Nacional</div>
              <div className="stat-label">Cobertura en todo el país</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⏰</div>
              <div className="stat-number">24 hs</div>
              <div className="stat-label">Atención al asegurado</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📋</div>
              <div className="stat-number">7</div>
              <div className="stat-label">Líneas de cobertura</div>
            </div>
          </div>
        </div>
      </section>

      {/* DARK FEATURE */}
      <section className="upgrades">
        <div className="upgrades-grid">
          <div className="upgrades-text" style={{ paddingLeft: "48px" }}>
            <h2>Un asesor a tu lado<br />en todo momento</h2>
            <ul className="upgrades-list">
              <li><span>📞</span> Atención personalizada antes de contratar</li>
              <li><span>📄</span> Gestión de pólizas sin trámites complicados</li>
              <li><span>🚨</span> Acompañamiento ante siniestros</li>
              <li><span>🔄</span> Revisión periódica de tu cobertura</li>
              <li><span>💬</span> Canal directo con tu asesor asignado</li>
            </ul>
          </div>
          <div className="upgrades-image">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80"
              alt="Asesor de seguros"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="decidir">
        <div className="container">
          <h2>¿Listo para proteger lo tuyo?</h2>
          <p>Cotizá en minutos o hablá con un asesor para encontrar la cobertura ideal.</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link className="btn btn-green" to="/cotizar">Empezar cotización</Link>
            <Link className="btn btn-outline" to="/contacto">Hablar con un asesor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
