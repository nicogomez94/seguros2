import { Link } from "react-router-dom";
import motoImage from "../assets/moto.png";
import trackerImage from "../assets/tracker2.png";

export default function HomePage() {
  const featuredPlans = [
    { icon: "🚗", title: "Seguro de Auto", price: "$35.000", to: "/cotizar?producto=AUTO", cta: "Cotizar" },
    { icon: "🏍️", title: "Seguro de Moto", price: "$12.500", to: "/cotizar?producto=MOTO", cta: "Cotizar" },
    { icon: "🩺", title: "Accidentes Personales", price: "$13.000", to: "/contacto", cta: "Consultar" },
    { icon: "🏠", title: "Seguro de Hogar", price: "$34.000", to: "/cotizar?producto=HOGAR", cta: "Cotizar" },
    { icon: "🚲", title: "Seguro de Bicicleta", price: "$20.000", to: "/cotizar?producto=BICICLETA", cta: "Cotizar" },
    { icon: "🌾", title: "Seguro Agro", price: "a medida", to: "/cotizar?producto=AGRO", cta: "Cotizar" },
    { icon: "👜", title: "Bolso Protegido", price: "$15.000", to: "/contacto", cta: "Consultar" },
    { icon: "✈️", title: "Seguro para Viajes", price: "$20.000", to: "/contacto", cta: "Consultar" },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">Seguros<br />Timbúes</h1>
            <p className="hero-price">
              Coberturas desde <strong>$12.500</strong>
            </p>
            <p className="hero-desc">
              Agente de seguros a nivel nacional en Argentina. Auto, salud, hogar,
              bicicleta, agro, comercio y responsabilidad civil.
            </p>
            <div className="hero-btns">
              <Link className="btn-hero-solid" to="/cotizar">Cotizá ahora</Link>
              <a className="btn-hero-outline" href="#planes">Ver planes</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-img-scene">
              <div className="hero-img-oval"></div>
              <img
                className="hero-img-moto"
                src={motoImage}
                alt="Moto asegurada"
              />
              <img
                className="hero-img-car"
                src={trackerImage}
                alt="Auto asegurado"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section className="planes" id="planes">
        <div className="container">
          <h2 className="text-center" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
            Planes destacados
          </h2>
          <p className="text-center subtitle">
            Precios base orientativos para resolver rápido la protección que necesitás.
          </p>
          <p className="text-center subtitle" style={{ marginTop: "-8px" }}>
            Coberturas médicas desde $60.000.
          </p>
          <div className="planes-grid">
            {featuredPlans.map((plan) => (
              <div className="plan-card" key={plan.title}>
                <div className="plan-icon">{plan.icon}</div>
                <h3>{plan.title}</h3>
                <div className="plan-price">desde <strong>{plan.price}</strong></div>
                <p className="plan-desc">Precio base sujeto a cobertura, perfil y condiciones de contratación.</p>
                <Link to={plan.to} className="btn btn-outline btn-full">{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DECIDIR */}
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

      {/* UPGRADES */}
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
              src="https://images.unsplash.com/photo-1666346166849-8443c47f50fa?w=900&q=80&auto=format&fit=crop"
              alt="Llaves de auto con cobertura de seguro"
            />
          </div>
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
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <h2 className="text-center">Lo que dicen nuestros clientes</h2>
          <div className="testimonials-grid">
            {[
              { name: "Marcela González", initials: "MG", date: "Marzo 2026", text: "Accedí a mi plan de salud sin complicaciones. El asesoramiento fue excelente." },
              { name: "Lucas Ramírez", initials: "LR", date: "Febrero 2026", text: "Conseguí un mejor seguro de auto. Rápido, claro y con buen precio." },
              { name: "Juan Ferreyra", initials: "JF", date: "Enero 2026", text: "Tuve un siniestro y el equipo estuvo disponible durante todo el proceso." },
              { name: "Valeria Pérez", initials: "VP", date: "Diciembre 2025", text: "Tramitaron todo de forma simple y el plan quedó mejor que el anterior." },
            ].map(({ name, initials, date, text }) => (
              <div className="testimonial-card" key={name}>
                <p>"{text}"</p>
                <div className="testimonial-author">
                  <div className="avatar">{initials}</div>
                  <div>
                    <strong>{name}</strong>
                    <span className="review-date">{date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
