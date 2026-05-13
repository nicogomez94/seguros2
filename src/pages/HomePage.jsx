import { Link } from "react-router-dom";
import { productDescriptions, productLabels } from "../data.js";

const featured = ["AUTO", "SALUD", "HOGAR"];
const allServices = ["AUTO", "MOTO", "SALUD", "HOGAR", "BICICLETA", "COMERCIO", "RESPONSABILIDAD_CIVIL"];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <h1>Seguros Timbúes</h1>
            <p className="hero-kicker">Pase lo que pase, estamos</p>
            <p>
              Agente de seguros a nivel nacional en Argentina. Encontrá el plan a tu medida:
              auto, salud, hogar, bicicleta, comercio y responsabilidad civil.
            </p>
            <div className="button-row">
              <Link className="btn primary" to="/cotizar">Cotizá ahora</Link>
              <a className="btn light" href="#planes">Ver planes</a>
            </div>
          </div>
          <img
            className="hero-car"
            src="https://static.vecteezy.com/system/resources/thumbnails/025/305/916/small/white-sport-car-on-transparent-background-3d-rendering-illustration-free-png.png"
            alt="Auto asegurado"
          />
        </div>
      </section>

      <section className="section muted" id="planes">
        <div className="container">
          <div className="section-title">
            <h2>Planes destacados</h2>
            <p>Opciones claras para resolver rápido la protección que necesitás.</p>
          </div>
          <div className="cards three">
            {featured.map((product, index) => (
              <article className={`card plan ${index === 1 ? "featured" : ""}`} key={product}>
                <span className="pill">{productLabels[product]}</span>
                <h3>{product === "AUTO" ? "desde $150" : product === "SALUD" ? "desde $200" : "desde $180"}</h3>
                <p>{productDescriptions[product]}</p>
                <Link className={`btn ${index === 1 ? "light" : "primary"}`} to={`/cotizar?producto=${product}`}>Cotizar</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Asesoramiento personalizado 24 hs</h2>
            <p className="lead">
              Si no sabés qué cobertura elegir, te guiamos con un formulario simple y una revisión comercial posterior.
            </p>
            <div className="service-list">
              {allServices.map((product) => (
                <Link key={product} to={`/cotizar?producto=${product}`}>{productLabels[product]}</Link>
              ))}
            </div>
          </div>
          <img
            className="rounded-image"
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80"
            alt="Vehículo con cobertura"
          />
        </div>
      </section>

      <section className="stats">
        <div className="container stats-grid">
          <div><strong>+1000</strong><span>Clientes satisfechos</span></div>
          <div><strong>Nacional</strong><span>Cobertura en todo el país</span></div>
          <div><strong>24 hs</strong><span>Atención al asegurado</span></div>
          <div><strong>SSN</strong><span>Referencia institucional</span></div>
        </div>
      </section>

      <section className="section muted">
        <div className="container">
          <div className="section-title">
            <h2>Lo que dicen nuestros clientes</h2>
          </div>
          <div className="cards four">
            {["Marcela González", "Lucas Ramírez", "Juan Ferreyra", "Valeria Pérez"].map((name, index) => (
              <article className="card testimonial" key={name}>
                <p>
                  {index === 0 && "Accedí a mi plan de salud sin complicaciones. El asesoramiento fue excelente."}
                  {index === 1 && "Conseguí un mejor seguro de auto. Rápido, claro y con buen precio."}
                  {index === 2 && "Tuve un siniestro y el equipo estuvo disponible durante todo el proceso."}
                  {index === 3 && "Tramitaron todo de forma simple y el plan quedó mejor que el anterior."}
                </p>
                <strong>{name}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
