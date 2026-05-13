import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { api } from "../lib/api.js";

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const location = useLocation();

  useEffect(() => {
    api("/api/public/company").then(setCompany).catch(() => null);
  }, []);

  useEffect(() => {
    let sections = [];
    let observer;

    const frame = requestAnimationFrame(() => {
      sections = Array.from(document.querySelectorAll("main section"));
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
      sections.forEach((section) => {
        section.classList.add("will-animate");
        observer.observe(section);
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      sections.forEach((s) => s.classList.remove("will-animate", "in-view"));
      if (observer) observer.disconnect();
    };
  }, [location.pathname]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link className="nav-logo" to="/" onClick={close}>
            <span className="logo-icon">S</span> Seguros Timbues
          </Link>
          <ul className={open ? "nav-links open" : "nav-links"}>
            <li><NavLink to="/" end onClick={close}>Inicio</NavLink></li>
            <li><NavLink to="/sobre-nosotros" onClick={close}>Sobre nosotros</NavLink></li>
            <li><NavLink to="/servicios" onClick={close}>Servicios</NavLink></li>
            <li><NavLink to="/contacto" onClick={close}>Contacto</NavLink></li>
          </ul>
          <div className="nav-cta">
            <NavLink
              className={({ isActive }) => (isActive ? "btn btn-outline active-link" : "btn btn-outline")}
              to="/cotizar"
              onClick={close}
            >
              Cotizar
            </NavLink>
          </div>
          <button className="hamburger" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
            &#9776;
          </button>
        </div>
      </nav>

      <Outlet />

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <h4>Navegacion</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/cotizar">Cotizar</Link></li>
              <li><Link to="/servicios">Servicios</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li>Tel. {company?.phone || "0800-666-8400"}</li>
              <li>Email {company?.email || "info@segurostimbues.com.ar"}</li>
              <li>{company?.address || "Timbues, Santa Fe, Argentina"}</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Seguinos</h4>
            <ul>
              <li>
                <a href={company?.instagram || "https://instagram.com/segurostimbues"} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.argentina.gob.ar/ssn" target="_blank" rel="noreferrer">SSN</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Institucional</h4>
            <ul>
              <li><Link to="/sobre-nosotros">Nuestra empresa</Link></li>
              <li><Link to="/servicios">Nuestros servicios</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-credit">
          <a
            className="footer-zigodev-btn"
            href="https://zigodev.com.ar"
            target="_blank"
            rel="noreferrer"
          >
            Hecho por ZigoDev
          </a>
        </div>
        <div className="footer-bottom">
          &copy; 2026 Seguros Timbues. Agente de seguros a nivel nacional.
        </div>
      </footer>
    </>
  );
}
