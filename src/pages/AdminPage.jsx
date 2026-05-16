import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productLabels } from "../data.js";
import { api, money } from "../lib/api.js";
import { WHATSAPP_PHONE_DISPLAY, WHATSAPP_URL } from "../lib/contact.js";

const statuses = { PENDING: "Pendiente", APPROVED: "Aprobada", REJECTED: "Rechazada" };
const statusCls = (s) => ({ PENDING: "pending", APPROVED: "approved", REJECTED: "rejected" }[s] || "pending");

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("quotes");
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api("/api/auth/me").then(setUser).catch(() => navigate("/admin/login"));
  }, [navigate]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => null);
    navigate("/admin/login");
  }

  if (!user) {
    return <div className="admin-body" style={{ alignItems: "center", justifyContent: "center" }}><p>Cargando...</p></div>;
  }

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  function nav(nextTab) {
    setTab(nextTab);
    setSidebarOpen(false);
  }

  return (
    <div className="admin-body">
      <aside className={sidebarOpen ? "admin-sidebar open" : "admin-sidebar"} id="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon" aria-hidden="true">{"\u{1F985}"}</span>
          <span>{"Seguros Timb\u00faes"}</span>
        </div>
        <nav className="sidebar-nav">
          <button className={tab === "quotes" ? "sidebar-link active" : "sidebar-link"} onClick={() => nav("quotes")}>
            <span aria-hidden="true">{"\u{1F4CB}"}</span> Cotizaciones
          </button>
          <button className={tab === "pricing" ? "sidebar-link active" : "sidebar-link"} onClick={() => nav("pricing")}>
            <span aria-hidden="true">{"\u{1F4B0}"}</span> Precios
          </button>
          <button className={tab === "company" ? "sidebar-link active" : "sidebar-link"} onClick={() => nav("company")}>
            <span aria-hidden="true">{"\u2699\uFE0F"}</span> {"Configuraci\u00f3n"}
          </button>
          <button className={tab === "users" ? "sidebar-link active" : "sidebar-link"} onClick={() => nav("users")}>
            <span aria-hidden="true">{"\u{1F465}"}</span> Administradores
          </button>
        </nav>
        <div className="sidebar-footer">
          <Link className="sidebar-link" to="/"><span aria-hidden="true">{"\u{1F310}"}</span> Ver sitio</Link>
          <button className="sidebar-link logout" onClick={logout}><span aria-hidden="true">{"\u{1F6AA}"}</span> Salir</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen((value) => !value)} aria-label={"Abrir men\u00fa"}>{"\u2630"}</button>
          <div className="topbar-title">{tabTitle(tab)}</div>
          <div className="topbar-actions">
            {message && <span className="toast-inline">{message}</span>}
            <div className="admin-user">
              <div className="user-avatar">{initials}</div>
              <span>{user.name}</span>
            </div>
          </div>
        </header>

        {tab === "quotes" && <QuotesPanel setMessage={setMessage} />}
        {tab === "pricing" && <PricingPanel setMessage={setMessage} />}
        {tab === "company" && <CompanyPanel setMessage={setMessage} />}
        {tab === "users" && <UsersPanel setMessage={setMessage} />}
      </div>
    </div>
  );
}

function tabTitle(tab) {
  return { quotes: "Cotizaciones", pricing: "Precios", company: "Configuraci\u00f3n", users: "Administradores" }[tab];
}

function QuotesPanel({ setMessage }) {
  const [filters, setFilters] = useState({ search: "", status: "", productType: "", page: 1 });
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [selected, setSelected] = useState(null);

  const query = useMemo(
    () => new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, value]) => value))).toString(),
    [filters]
  );

  async function load() {
    setData(await api("/api/admin/quotes?" + query));
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, [query]);

  async function changeStatus(id, status) {
    await api("/api/admin/quotes/" + id, { method: "PATCH", body: { status } });
    setMessage("Estado actualizado");
    load();
  }

  async function remove(id) {
    await api("/api/admin/quotes/" + id, { method: "DELETE" });
    setMessage("Cotizaci\u00f3n eliminada");
    setSelected(null);
    load();
  }

  return (
    <div className="admin-section">
      <div className="section-topbar">
        <h2>Cotizaciones</h2>
        <Link className="btn btn-green" to="/cotizar" target="_blank">{"+ Nueva cotizaci\u00f3n"}</Link>
      </div>

      <div className="filters-bar">
        <input
          className="filter-input"
          placeholder={"\u{1F50E} Buscar por cliente, email o n\u00famero..."}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
        />
        <select className="filter-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">Todos los estados</option>
          {Object.entries(statuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <select className="filter-select" value={filters.productType} onChange={(e) => setFilters({ ...filters, productType: e.target.value, page: 1 })}>
          <option value="">Todos los productos</option>
          {Object.entries(productLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Producto</th>
                <th>Plan</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((quote) => (
                <tr key={quote.id}>
                  <td data-label="#">#{quote.code}</td>
                  <td data-label="Cliente">{quote.person?.firstName} {quote.person?.lastName}</td>
                  <td data-label="Email">{quote.person?.email}</td>
                  <td data-label="Producto">{productLabels[quote.productType]}</td>
                  <td data-label="Plan">{quote.planName}</td>
                  <td data-label="Precio">{money(quote.estimatedTotal)}</td>
                  <td data-label="Estado"><span className={"status-badge " + statusCls(quote.status)}>{statuses[quote.status]}</span></td>
                  <td data-label="Fecha">{new Date(quote.createdAt).toLocaleDateString("es-AR")}</td>
                  <td className="actions-cell" data-label="Acciones">
                    <button className="btn btn-xs btn-outline" onClick={() => setSelected(quote)} aria-label={"Ver detalle"}>{"\u{1F441}\uFE0F"}</button>
                    <select className="btn btn-xs" style={{ cursor: "pointer" }} value={quote.status} onChange={(e) => changeStatus(quote.id, e.target.value)}>
                      {Object.entries(statuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                    <button className="btn btn-xs btn-danger" onClick={() => remove(quote.id)} aria-label={"Eliminar cotizaci\u00f3n"}>{"\u{1F5D1}\uFE0F"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button className="btn btn-xs btn-outline" disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>
            {"\u2039 Anterior"}
          </button>
          <span className="page-info">{"P\u00e1gina"} {filters.page} de {data.pages} {"\u00b7"} {data.total} registros</span>
          <button className="btn btn-xs btn-outline" disabled={filters.page >= data.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>
            {"Siguiente \u203a"}
          </button>
        </div>
      </div>

      {selected && <QuoteDetail quote={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function QuoteDetail({ quote, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <article className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>{"\u00d7"}</button>
        <h2>{"Cotizaci\u00f3n"} #{quote.code}</h2>
        <p><strong>Cliente:</strong> {quote.person?.firstName} {quote.person?.lastName}</p>
        <p><strong>Email:</strong> {quote.person?.email}</p>
        <p><strong>{"Tel\u00e9fono:"}</strong> {quote.person?.phone}</p>
        <p><strong>Producto:</strong> {productLabels[quote.productType]} {"\u00b7"} {quote.planName}</p>
        <p><strong>Total:</strong> {money(quote.estimatedTotal)}</p>
        <p>
          <strong>WhatsApp Seguros:</strong>{" "}
          <a className="admin-detail-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            {WHATSAPP_PHONE_DISPLAY}
          </a>
        </p>
        <h3>{"Datos espec\u00edficos"}</h3>
        <pre>{JSON.stringify(quote.productData?.data || {}, null, 2)}</pre>
        <h3>Extras</h3>
        <p>{quote.extras?.length ? quote.extras.map((extra) => extra.name).join(", ") : "Sin extras"}</p>
      </article>
    </div>
  );
}

function PricingPanel({ setMessage }) {
  const [pricing, setPricing] = useState({ plans: [], extras: [] });

  useEffect(() => {
    api("/api/admin/pricing").then(setPricing).catch((error) => setMessage(error.message));
  }, []);

  function update(kind, id, field, value) {
    setPricing((current) => ({
      ...current,
      [kind]: current[kind].map((item) => (
        item.id === id ? { ...item, [field]: field === "active" ? value : Number(value) } : item
      ))
    }));
  }

  async function save() {
    await api("/api/admin/pricing", { method: "PATCH", body: pricing });
    setMessage("Precios guardados");
  }

  const groupedPlans = groupPricingItems(pricing.plans);
  const groupedExtras = groupPricingItems(pricing.extras);

  return (
    <div className="admin-section">
      <div className="section-topbar"><h2>Precios</h2></div>
      <div className="config-grid">
        <div className="config-card">
          <h3>Planes</h3>
          <div className="pricing-groups">
            {groupedPlans.map(([productType, plans]) => (
              <section className="pricing-group" key={productType}>
                <div className="pricing-group-header">
                  <h4>{productLabels[productType]}</h4>
                  <span>{plans.length} planes</span>
                </div>
                <div className="pricing-group-body">
                  {plans.map((plan) => (
                    <div className="price-row" key={plan.id}>
                      <span>{plan.planName}</span>
                      <input type="number" className="form-input" value={plan.basePrice} onChange={(e) => update("plans", plan.id, "basePrice", e.target.value)} />
                      <input type="checkbox" checked={plan.active} onChange={(e) => update("plans", plan.id, "active", e.target.checked)} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <div className="config-card">
          <h3>Extras</h3>
          <div className="pricing-groups">
            {groupedExtras.map(([productType, extras]) => (
              <section className="pricing-group" key={productType}>
                <div className="pricing-group-header">
                  <h4>{productLabels[productType]}</h4>
                  <span>{extras.length} extras</span>
                </div>
                <div className="pricing-group-body">
                  {extras.map((extra) => (
                    <div className="price-row" key={extra.id}>
                      <span>{extra.name}</span>
                      <input type="number" className="form-input" value={extra.price} onChange={(e) => update("extras", extra.id, "price", e.target.value)} />
                      <input type="checkbox" checked={extra.active} onChange={(e) => update("extras", extra.id, "active", e.target.checked)} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      <button className="btn btn-green" onClick={save}>Guardar precios</button>
    </div>
  );
}

function groupPricingItems(items) {
  return Object.entries(
    items.reduce((groups, item) => {
      if (!groups[item.productType]) groups[item.productType] = [];
      groups[item.productType].push(item);
      return groups;
    }, {})
  );
}

function CompanyPanel({ setMessage }) {
  const [company, setCompany] = useState(null);
  const companyFields = [
    { key: "name", label: "Nombre de la empresa", hint: "Nombre visible de la marca en el sitio." },
    { key: "email", label: "Correo electr\u00f3nico", hint: "Canal principal para recibir consultas." },
    { key: "phone", label: "Tel\u00e9fono", hint: "N\u00famero de contacto para atenci\u00f3n comercial." },
    { key: "address", label: "Direcci\u00f3n", hint: "Ubicaci\u00f3n comercial o punto de referencia." },
    { key: "instagram", label: "Instagram", hint: "Enlace al perfil oficial de la empresa." },
    { key: "facebook", label: "Facebook", hint: "Enlace al perfil oficial de Facebook." }
  ];

  useEffect(() => {
    api("/api/admin/company")
      .then((settings) => setCompany({ ...settings, phone: settings?.phone || WHATSAPP_PHONE_DISPLAY }))
      .catch((error) => setMessage(error.message));
  }, []);

  if (!company) {
    return <div className="admin-section">Cargando...</div>;
  }

  async function save() {
    setCompany(await api("/api/admin/company", { method: "PATCH", body: company }));
    setMessage("Datos de empresa guardados");
  }

  return (
    <div className="admin-section">
      <div className="section-topbar"><h2>{"Configuraci\u00f3n"}</h2></div>
      <div className="config-grid">
        <div className="config-card company-config-card">
          <div className="company-config-head">
            <div>
              <h3>Datos de la empresa</h3>
              <p>{"Actualiz\u00e1 la informaci\u00f3n institucional y de contacto que ven los clientes."}</p>
            </div>
            <span className="company-config-badge">Perfil comercial</span>
          </div>
          <div className="company-fields-grid">
            {companyFields.map(({ key, label, hint }) => (
              <div className="form-group company-form-group" key={key}>
                <label>{label}</label>
                <span className="company-field-hint">{hint}</span>
                <input
                  className="form-input company-form-input"
                  value={company[key] || ""}
                  onChange={(e) => setCompany({ ...company, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div className="company-config-actions">
            <button className="btn btn-green" onClick={save}>Guardar cambios</button>
            <span className="company-config-note">{"Los cambios se reflejan en los datos p\u00fablicos del sitio."}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersPanel({ setMessage }) {
  const empty = { name: "", email: "", password: "", role: "EDITOR", active: true };
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);

  async function load() {
    setUsers(await api("/api/admin/users"));
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  async function create(event) {
    event.preventDefault();
    await api("/api/admin/users", { method: "POST", body: form });
    setForm(empty);
    setMessage("Administrador creado");
    load();
  }

  async function patch(id, changes) {
    await api("/api/admin/users/" + id, { method: "PATCH", body: changes });
    setMessage("Administrador actualizado");
    load();
  }

  return (
    <div className="admin-section">
      <div className="section-topbar"><h2>Administradores</h2></div>
      <div className="config-grid">
        <div className="config-card">
          <h3>Usuarios existentes</h3>
          <div className="admin-users-list">
            {users.map((user) => (
              <div className="admin-user-row" key={user.id}>
                <span className="user-avatar small">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </span>
                <div><strong>{user.name}</strong><p>{user.email}</p></div>
                <span className={user.role === "EDITOR" ? "role-badge role-editor" : "role-badge"}>{user.role}</span>
                <button className="btn btn-xs btn-outline" onClick={() => patch(user.id, { active: !user.active })}>
                  {user.active ? "Desactivar" : "Activar"}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="config-card">
          <h3>Nuevo administrador</h3>
          <form onSubmit={create} className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input required className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input required type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{"Contrase\u00f1a"}</label>
              <input required className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="EDITOR">EDITOR</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
            <div className="form-group form-group-full">
              <button className="btn btn-green">Crear administrador</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
