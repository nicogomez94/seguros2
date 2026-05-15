import { Link } from "react-router-dom";
import { productDescriptions, productLabels } from "../data.js";

const serviceIcons = {
  AUTO: "🚗",
  MOTO: "🏍️",
  SALUD: "🏥",
  HOGAR: "🏠",
  BICICLETA: "🚲",
  AGRO: "🌾",
  COMERCIO: "🏪",
  RESPONSABILIDAD_CIVIL: "⚖️",
};

const servicePrices = {
  AUTO: "$150",
  MOTO: "$90",
  SALUD: "$200",
  HOGAR: "$180",
  BICICLETA: "$60",
  AGRO: "$320",
  COMERCIO: "$250",
  RESPONSABILIDAD_CIVIL: "$120",
};

const features = [
  { icon: "📋", title: "Cotización sin compromiso", desc: "Completá el formulario y recibís una propuesta adaptada a tu situación sin obligación de contratar." },
  { icon: "🔒", title: "Cobertura desde el primer día", desc: "Una vez aprobada la póliza, tu cobertura entra en vigencia de inmediato." },
  { icon: "📞", title: "Soporte ante siniestros", desc: "Nuestros asesores te acompañan en el proceso de denuncia y seguimiento del reclamo." },
];

export default function ServicesPage() {
  const products = Object.keys(productLabels);

  return (
    <main>
      {/* HERO */}
      <section className="page-hero">
        <div className="container text-center">
          <h1>Nuestros Servicios</h1>
          <p>Coberturas para personas, familias y comercios. Encontrá la que mejor se adapta a vos.</p>
        </div>
      </section>

      {/* SERVICIOS GRID */}
      <section style={{ padding: "72px 0", background: "var(--gray-bg)" }}>
        <div className="container">
          <h2 className="text-center" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
            Todas las coberturas
          </h2>
          <p className="text-center subtitle">
            Trabajamos con las aseguradoras líderes del mercado para ofrecerte las mejores opciones.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px", marginTop: "40px" }}>
            {products.map((key, i) => (
              <div
                key={key}
                className={`plan-card${i === 2 ? " plan-featured" : ""}`}
              >
                {i === 2 && <span className="badge badge-white">Más solicitado</span>}
                <div className="plan-icon">{serviceIcons[key]}</div>
                <h3>{productLabels[key]}</h3>
                <div className="plan-price">
                  desde <strong>{servicePrices[key]}</strong>/mes
                </div>
                <p className="plan-desc">{productDescriptions[key]}</p>
                <Link to={`/cotizar?producto=${key}`} className={`btn btn-full${i === 2 ? " btn-white" : " btn-outline"}`}>
                  Cotizar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section style={{ padding: "72px 0", background: "#fff" }}>
        <div className="container">
          <h2 className="text-center" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
            ¿Cómo funciona?
          </h2>
          <p className="text-center subtitle">Tres pasos simples para tener tu cobertura activa.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px", marginTop: "48px" }}>
            {[
              { num: "01", title: "Completás el formulario", desc: "Elegís el tipo de cobertura e ingresás los datos básicos sobre lo que querés asegurar." },
              { num: "02", title: "Recibís tu cotización", desc: "En el día te enviamos una propuesta detallada con las opciones que mejor se adaptan a tu caso." },
              { num: "03", title: "Contratás y listo", desc: "Confirmás, firmás la póliza y tu cobertura entra en vigencia de inmediato." },
            ].map((step) => (
              <div key={step.num} style={{ textAlign: "center", padding: "32px 24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "2.8rem", fontWeight: 900, color: "var(--green)", marginBottom: "16px", lineHeight: 1 }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>{step.title}</h3>
                <p style={{ fontSize: "0.93rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLEMENTOS */}
      <section className="upgrades">
        <div className="container">
        <div className="upgrades-grid">
          <div className="upgrades-text">
            <h2>Complementos que<br />marcan la diferencia</h2>
            <ul className="upgrades-list">
              <li><span>🔧</span> Asistencia en ruta 24 hs</li>
              <li><span>🚕</span> Auto de reemplazo</li>
              <li><span>🏥</span> Lesiones personales</li>
              <li><span>🎯</span> Bonus Accelerator</li>
              <li><span>🔑</span> Reposición de llaves</li>
            </ul>
          </div>
          <div className="upgrades-image">
            <img
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80"
              alt="Coberturas adicionales"
            />
          </div>
        </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "72px 0", background: "var(--gray-bg)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {features.map((f) => (
              <div key={f.title} className="testimonial-card" style={{ borderLeft: "4px solid var(--green)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontStyle: "normal", fontSize: "0.93rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="decidir">
        <div className="container">
          <h2>¿No sabés qué seguro elegir?</h2>
          <p>Te guiamos para encontrar la cobertura ideal según tu situación y necesidades.</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link className="btn btn-green" to="/cotizar">Empezar cotización</Link>
            <Link className="btn btn-outline" to="/contacto">Hablar con un asesor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
