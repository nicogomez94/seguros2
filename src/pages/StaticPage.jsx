import { Link } from "react-router-dom";
import { productDescriptions, productLabels } from "../data.js";

const copy = {
  about: {
    title: "Sobre nosotros",
    text: "Seguros Timbúes brinda asesoramiento de seguros a nivel nacional con foco en claridad, respuesta rápida y acompañamiento posterior a la contratación.",
    bullets: ["Atención personalizada", "Coberturas para personas, hogares y comercios", "Orientación comercial antes de elegir un plan"]
  },
  services: {
    title: "Servicios",
    text: "Trabajamos distintas líneas de cobertura para resolver necesidades personales, familiares y comerciales.",
    bullets: Object.keys(productLabels).map((key) => `${productLabels[key]}: ${productDescriptions[key]}`)
  },
  blog: {
    title: "Blog",
    text: "Novedades y guías simples para entender mejor tus coberturas.",
    bullets: ["Cómo elegir un seguro automotor", "Qué revisar antes de asegurar tu hogar", "Cuándo conviene ampliar una responsabilidad civil"]
  }
};

export default function StaticPage({ type }) {
  const page = copy[type] || copy.about;
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>{page.title}</h1>
          <p>{page.text}</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <div className="card content-card">
            {page.bullets.map((item) => <p key={item}>{item}</p>)}
            <Link className="btn primary" to="/cotizar">Solicitar cotización</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
