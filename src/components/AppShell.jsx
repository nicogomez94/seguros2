import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { api } from "../lib/api.js";

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    api("/api/public/company").then(setCompany).catch(() => null);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link className="nav-logo" to="/" onClick={close}>
            <span className="logo-icon">🦅</span> Seguros Timbúes
          </Link>
          <ul className={open ? "nav-links open" : "nav-links"}>
            <li><NavLink to="/" end onClick={close}>Inicio</NavLink></li>
            <li><NavLink to="/sobre-nosotros" onClick={close}>Sobre nosotros</NavLink></li>
            <li><NavLink to="/servicios" onClick={close}>Servicios</NavLink></li>
            <li><NavLink to="/contacto" onClick={close}>Contacto</NavLink></li>
          </ul>
          <div className="nav-cta">
            <NavLink
              className={({ isActive }) => isActive ? "btn btn-outline active-link" : "btn btn-outline"}
              to="/cotizar"
              onClick={close}
            >
              Cotizar
            </NavLink>
            <NavLink className="btn btn-sm-ghost" to="/admin" onClick={close}>
              Admin
            </NavLink>
          </div>
          <button className="hamburger" onClick={() => setOpen((v) => !v)} aria-label="Abrir menú">
            &#9776;
          </button>
        </div>
      </nav>

      <Outlet />

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <h4>Navegación</h4>
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
              <li>📞 {company?.phone || "0800-666-8400"}</li>
              <li>✉ {company?.email || "info@segurostimbues.com.ar"}</li>
              <li>📍 {company?.address || "Timbúes, Santa Fe, Argentina"}</li>
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
              <li>
                <a href="https://zigodev.com.ar" target="_blank" rel="noreferrer">Hecho por ZigoDev</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Seguros Timbúes. Agente de seguros a nivel nacional.
        </div>
      </footer>
    </>
  );
}
