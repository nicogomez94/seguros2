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
      <header className="site-header">
        <div className="nav-container">
          <Link className="brand" to="/" onClick={close}>
            <span className="brand-mark">ST</span>
            Seguros Timbúes
          </Link>
          <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Abrir menú">
            ☰
          </button>
          <nav className={`site-nav ${open ? "open" : ""}`}>
            <NavLink onClick={close} to="/">Inicio</NavLink>
            <NavLink onClick={close} to="/sobre-nosotros">Sobre nosotros</NavLink>
            <NavLink onClick={close} to="/servicios">Servicios</NavLink>
            <NavLink onClick={close} to="/blog">Blog</NavLink>
            <NavLink onClick={close} to="/contacto">Contacto</NavLink>
            <NavLink onClick={close} className="nav-quote" to="/cotizar">Cotizar</NavLink>
            <NavLink onClick={close} className="nav-admin" to="/admin">Admin</NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h4>Navegación</h4>
            <Link to="/">Inicio</Link>
            <Link to="/servicios">Servicios</Link>
            <Link to="/cotizar">Cotizar</Link>
            <Link to="/contacto">Contacto</Link>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>{company?.phone || "0800-666-8400"}</p>
            <p>{company?.email || "info@segurostimbues.com.ar"}</p>
            <p>{company?.address || "Timbúes, Santa Fe, Argentina"}</p>
          </div>
          <div>
            <h4>Seguinos</h4>
            <a href={company?.instagram || "https://instagram.com/segurostimbues"} target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.argentina.gob.ar/ssn" target="_blank" rel="noreferrer">SSN</a>
          </div>
          <div>
            <h4>Institucional</h4>
            <Link to="/sobre-nosotros">Nuestra empresa</Link>
            <Link to="/blog">Novedades</Link>
            <a href="https://zigodev.com.ar" target="_blank" rel="noreferrer">Hecho por ZigoDev</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Seguros Timbúes. Agente de seguros a nivel nacional.
        </div>
      </footer>
    </>
  );
}
