import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEnvelope, faFileSignature, faHome, faInfoCircle, faShieldHalved, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { api } from "../lib/api.js";
import { WHATSAPP_PHONE_DISPLAY, WHATSAPP_URL } from "../lib/contact.js";

const navItems = [
  { to: "/", label: "Inicio", end: true, icon: faHome },
  { to: "/sobre-nosotros", label: "Sobre nosotros", icon: faInfoCircle },
  { to: "/servicios", label: "Servicios", icon: faShieldHalved },
  { to: "/contacto", label: "Contacto", icon: faEnvelope }
];

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const location = useLocation();
  const contactPhone = company?.phone && company.phone !== "0800-666-8400" ? company.phone : WHATSAPP_PHONE_DISPLAY;

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
            <span className="logo-icon" aria-hidden="true">🦅</span> Seguros Timbues
          </Link>
          <ul className={open ? "nav-links open" : "nav-links"}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} onClick={close}>
                  <FontAwesomeIcon icon={item.icon} className="nav-link-icon" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            <li className="mobile-menu-quote">
              <NavLink to="/cotizar" onClick={close}>
                <FontAwesomeIcon icon={faFileSignature} className="nav-link-icon" aria-hidden="true" />
                <span>Cotizar</span>
              </NavLink>
            </li>
          </ul>
          <div className="nav-cta">
            <NavLink
              className={({ isActive }) => (isActive ? "btn btn-outline active-link" : "btn btn-outline")}
              to="/cotizar"
              onClick={close}
            >
              <FontAwesomeIcon icon={faFileSignature} className="nav-link-icon" aria-hidden="true" />
              Cotizar
            </NavLink>
          </div>
          <button className="hamburger" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
            <FontAwesomeIcon icon={open ? faXmark : faBars} aria-hidden="true" />
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
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  Tel. {contactPhone}
                </a>
              </li>
              <li>Email {company?.email || "info@segurostimbues.com.ar"}</li>
              <li>{company?.address || "Timbues, Santa Fe, Argentina"}</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Seguinos</h4>
            <ul>
              <li>
                <a
                  href={company?.facebook || "https://www.facebook.com/profile.php?id=100069758515302"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a href={company?.instagram || "https://instagram.com/segurostimbues"} target="_blank" rel="noreferrer">
                  Instagram
                </a>
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
        <div className="footer-bottom">
          <span>&copy; 2026 Seguros Timbues. Agente de seguros a nivel nacional.</span>
          <a
            className="footer-zigodev-btn"
            href="https://zigodev.com.ar"
            target="_blank"
            rel="noreferrer"
          >
            Hecho por ZigoDev
          </a>
        </div>
      </footer>
      <a
        className="floating-whatsapp"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={`Escribir por WhatsApp al ${WHATSAPP_PHONE_DISPLAY}`}
      >
        <svg aria-hidden="true" viewBox="0 0 32 32">
          <path d="M16.01 4.02c-6.61 0-11.99 5.36-11.99 11.96 0 2.1.55 4.15 1.61 5.96l-1.7 6.04 6.18-1.58a11.96 11.96 0 0 0 5.9 1.54c6.61 0 11.99-5.36 11.99-11.96S22.62 4.02 16.01 4.02Zm0 21.9c-1.87 0-3.69-.52-5.27-1.51l-.38-.24-3.67.94.99-3.58-.25-.4a9.87 9.87 0 0 1-1.38-5.15c0-5.48 4.47-9.94 9.96-9.94s9.96 4.46 9.96 9.94-4.47 9.94-9.96 9.94Zm5.46-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.49-.89-.79-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </>
  );
}
