import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productLabels } from "../data.js";
import { api, money } from "../lib/api.js";

const statuses = { PENDING: "Pendiente", APPROVED: "Aprobada", REJECTED: "Rechazada" };

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("quotes");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api("/api/auth/me").then(setUser).catch(() => navigate("/admin/login"));
  }, [navigate]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => null);
    navigate("/admin/login");
  }

  if (!user) return <main className="admin-shell"><p>Cargando...</p></main>;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand admin-brand" to="/"><span className="brand-mark">ST</span>Seguros Timbúes</Link>
        <button className={tab === "quotes" ? "active" : ""} onClick={() => setTab("quotes")}>Cotizaciones</button>
        <button className={tab === "pricing" ? "active" : ""} onClick={() => setTab("pricing")}>Precios</button>
        <button className={tab === "company" ? "active" : ""} onClick={() => setTab("company")}>Empresa</button>
        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Administradores</button>
        <div className="sidebar-footer">
          <Link to="/">Ver sitio público</Link>
          <button onClick={logout}>Salir</button>
        </div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>{tabTitle(tab)}</h1>
            <p>{user.name} · {user.role}</p>
          </div>
          {message && <span className="toast-inline">{message}</span>}
        </header>
        {tab === "quotes" && <QuotesPanel setMessage={setMessage} />}
        {tab === "pricing" && <PricingPanel setMessage={setMessage} />}
        {tab === "company" && <CompanyPanel setMessage={setMessage} />}
        {tab === "users" && <UsersPanel setMessage={setMessage} />}
      </section>
    </main>
  );
}

function tabTitle(tab) {
  return { quotes: "Cotizaciones", pricing: "Precios", company: "Datos de empresa", users: "Administradores" }[tab];
}

function QuotesPanel({ setMessage }) {
  const [filters, setFilters] = useState({ search: "", status: "", productType: "", planCode: "", page: 1 });
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [selected, setSelected] = useState(null);

  const query = useMemo(() => new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, value]) => value))).toString(), [filters]);

  async function load() {
    setData(await api(`/api/admin/quotes?${query}`));
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, [query]);

  async function changeStatus(id, status) {
    await api(`/api/admin/quotes/${id}`, { method: "PATCH", body: { status } });
    setMessage("Estado actualizado");
    load();
  }

  async function remove(id) {
    await api(`/api/admin/quotes/${id}`, { method: "DELETE" });
    setMessage("Cotización eliminada");
    setSelected(null);
    load();
  }

  return (
    <div className="admin-content">
      <div className="filters-bar">
        <input placeholder="Buscar cliente, email o número" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">Todos los estados</option>
          {Object.entries(statuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <select value={filters.productType} onChange={(e) => setFilters({ ...filters, productType: e.target.value, page: 1 })}>
          <option value="">Todos los productos</option>
          {Object.entries(productLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <Link className="btn primary" to="/cotizar">Nueva cotización</Link>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>#</th><th>Cliente</th><th>Producto</th><th>Plan</th><th>Precio</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {data.items.map((quote) => (
              <tr key={quote.id}>
                <td>#{quote.code}</td>
                <td>{quote.person?.firstName} {quote.person?.lastName}<small>{quote.person?.email}</small></td>
                <td>{productLabels[quote.productType]}</td>
                <td>{quote.planName}</td>
                <td>{money(quote.estimatedTotal)}</td>
                <td><span className={`status ${quote.status.toLowerCase()}`}>{statuses[quote.status]}</span></td>
                <td>{new Date(quote.createdAt).toLocaleDateString("es-AR")}</td>
                <td className="actions">
                  <button onClick={() => setSelected(quote)}>Ver</button>
                  <select value={quote.status} onChange={(e) => changeStatus(quote.id, e.target.value)}>
                    {Object.entries(statuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                  <button className="danger" onClick={() => remove(quote.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Anterior</button>
          <span>Página {filters.page} de {data.pages} · {data.total} registros</span>
          <button disabled={filters.page >= data.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Siguiente</button>
        </div>
      </div>
      {selected && <QuoteDetail quote={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function QuoteDetail({ quote, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <article className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Cotización #{quote.code}</h2>
        <p><strong>Cliente:</strong> {quote.person?.firstName} {quote.person?.lastName}</p>
        <p><strong>Email:</strong> {quote.person?.email}</p>
        <p><strong>Teléfono:</strong> {quote.person?.phone}</p>
        <p><strong>Producto:</strong> {productLabels[quote.productType]} · {quote.planName}</p>
        <p><strong>Total:</strong> {money(quote.estimatedTotal)}</p>
        <h3>Datos específicos</h3>
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
      [kind]: current[kind].map((item) => (item.id === id ? { ...item, [field]: field === "active" ? value : Number(value) } : item))
    }));
  }

  async function save() {
    await api("/api/admin/pricing", { method: "PATCH", body: pricing });
    setMessage("Precios guardados");
  }

  return (
    <div className="admin-content">
      <div className="admin-grid two">
        <section className="admin-card">
          <h2>Planes</h2>
          {pricing.plans.map((plan) => (
            <label className="price-row" key={plan.id}>
              <span>{productLabels[plan.productType]} · {plan.planName}</span>
              <input type="number" value={plan.basePrice} onChange={(e) => update("plans", plan.id, "basePrice", e.target.value)} />
              <input type="checkbox" checked={plan.active} onChange={(e) => update("plans", plan.id, "active", e.target.checked)} />
            </label>
          ))}
        </section>
        <section className="admin-card">
          <h2>Extras</h2>
          {pricing.extras.map((extra) => (
            <label className="price-row" key={extra.id}>
              <span>{productLabels[extra.productType]} · {extra.name}</span>
              <input type="number" value={extra.price} onChange={(e) => update("extras", extra.id, "price", e.target.value)} />
              <input type="checkbox" checked={extra.active} onChange={(e) => update("extras", extra.id, "active", e.target.checked)} />
            </label>
          ))}
        </section>
      </div>
      <button className="btn primary" onClick={save}>Guardar precios</button>
    </div>
  );
}

function CompanyPanel({ setMessage }) {
  const [company, setCompany] = useState(null);
  useEffect(() => {
    api("/api/admin/company").then(setCompany).catch((error) => setMessage(error.message));
  }, []);
  if (!company) return <div className="admin-content">Cargando...</div>;

  async function save() {
    setCompany(await api("/api/admin/company", { method: "PATCH", body: company }));
    setMessage("Datos de empresa guardados");
  }

  return (
    <div className="admin-content">
      <section className="admin-card form-grid">
        {["name", "email", "phone", "address", "instagram"].map((field) => (
          <label key={field}>{field}<input value={company[field] || ""} onChange={(e) => setCompany({ ...company, [field]: e.target.value })} /></label>
        ))}
      </section>
      <button className="btn primary" onClick={save}>Guardar cambios</button>
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
    await api(`/api/admin/users/${id}`, { method: "PATCH", body: changes });
    setMessage("Administrador actualizado");
    load();
  }

  return (
    <div className="admin-content">
      <section className="admin-card">
        <h2>Administradores</h2>
        {users.map((user) => (
          <div className="user-row" key={user.id}>
            <div><strong>{user.name}</strong><span>{user.email} · {user.role}</span></div>
            <select value={user.role} onChange={(e) => patch(user.id, { role: e.target.value })}>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="EDITOR">EDITOR</option>
            </select>
            <button onClick={() => patch(user.id, { active: !user.active })}>{user.active ? "Desactivar" : "Activar"}</button>
          </div>
        ))}
      </section>
      <form className="admin-card form-grid" onSubmit={create}>
        <h2 className="full">Nuevo administrador</h2>
        <label>Nombre<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Contraseña<input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label>Rol<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="EDITOR">EDITOR</option><option value="SUPER_ADMIN">SUPER_ADMIN</option></select></label>
        <button className="btn primary">Crear administrador</button>
      </form>
    </div>
  );
}
