import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">Seguros<br />Timbúes</h1>
            <p className="hero-price">
              Cobertura desde <strong>$150</strong>/mes
            </p>
            <p className="hero-desc">
              Agente de seguros a nivel nacional en Argentina. Auto, salud, hogar,
              bicicleta, comercio y responsabilidad civil.
            </p>
            <div className="hero-btns">
              <Link className="btn-hero-solid" to="/cotizar">Cotizá ahora</Link>
              <a className="btn-hero-outline" href="#planes">Ver planes</a>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80"
              alt="Auto asegurado"
            />
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
            Opciones claras para resolver rápido la protección que necesitás.
          </p>
          <div className="planes-grid">
            <div className="plan-card">
              <div className="plan-icon">🚗</div>
              <h3>Seguro de Auto</h3>
              <div className="plan-price">desde <strong>$150</strong>/mes</div>
              <p className="plan-desc">Responsabilidad civil, robo parcial e incendio total.</p>
              <Link to="/cotizar?producto=AUTO" className="btn btn-outline btn-full">Cotizar</Link>
            </div>
            <div className="plan-card plan-featured">
              <span className="badge badge-white">Más popular</span>
              <div className="plan-icon">🏥</div>
              <h3>Seguro de Salud</h3>
              <div className="plan-price">desde <strong>$200</strong>/mes</div>
              <p className="plan-desc">Cobertura médica integral para toda la familia.</p>
              <Link to="/cotizar?producto=SALUD" className="btn btn-white btn-full">Cotizar</Link>
            </div>
            <div className="plan-card">
              <div className="plan-icon">🏠</div>
              <h3>Seguro de Hogar</h3>
              <div className="plan-price">desde <strong>$180</strong>/mes</div>
              <p className="plan-desc">Protección integral para tu casa: incendio, robo y daños.</p>
              <Link to="/cotizar?producto=HOGAR" className="btn btn-outline btn-full">Cotizar</Link>
            </div>
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
              alt="Auto con cobertura"
            />
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
              <div className="stat-icon">🏛️</div>
              <div className="stat-number">SSN</div>
              <div className="stat-label">Referencia institucional</div>
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
              { name: "Marcela González", initials: "MG", date: "Marzo 2026",    text: "Accedí a mi plan de salud sin complicaciones. El asesoramiento fue excelente." },
              { name: "Lucas Ramírez",    initials: "LR", date: "Febrero 2026",  text: "Conseguí un mejor seguro de auto. Rápido, claro y con buen precio." },
              { name: "Juan Ferreyra",    initials: "JF", date: "Enero 2026",    text: "Tuve un siniestro y el equipo estuvo disponible durante todo el proceso." },
              { name: "Valeria Pérez",    initials: "VP", date: "Diciembre 2025",text: "Tramitaron todo de forma simple y el plan quedó mejor que el anterior." },
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
