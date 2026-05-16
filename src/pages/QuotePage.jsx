import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { debugPerson, debugProductData, productDescriptions, productFields, productLabels } from "../data.js";
import { api, isDebug, money } from "../lib/api.js";
import { WHATSAPP_PHONE_DISPLAY, WHATSAPP_URL } from "../lib/contact.js";

const products = Object.keys(productLabels);
const STEP_LABELS = ["Producto", "Tu vehículo", "Tus datos", "Cobertura", "Confirmación"];

export default function QuotePage() {
  const [params] = useSearchParams();
  const initialProduct = params.get("producto") && productLabels[params.get("producto")]
    ? params.get("producto") : "AUTO";
  const [step, setStep] = useState(1);
  const [pricing, setPricing] = useState({ plans: [], extras: [] });
  const [productType, setProductType] = useState(initialProduct);
  const [planCode, setPlanCode] = useState("basica");
  const [extraCodes, setExtraCodes] = useState([]);
  const [productData, setProductData] = useState(isDebug ? debugProductData[initialProduct] : {});
  const [person, setPerson] = useState(isDebug ? debugPerson : {});
  const [createdQuote, setCreatedQuote] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api("/api/public/pricing").then(setPricing).catch((e) => setMessage(e.message));
  }, []);

  useEffect(() => {
    setPlanCode("basica");
    setExtraCodes([]);
    setProductData(isDebug ? debugProductData[productType] : {});
  }, [productType]);

  const plans = pricing.plans.filter((p) => p.productType === productType);
  const extras = pricing.extras.filter((p) => p.productType === productType);
  const selectedPlan = plans.find((p) => p.planCode === planCode) || plans[0];
  const selectedExtras = extras.filter((p) => extraCodes.includes(p.code));
  const surcharge = useMemo(() => localSurcharge(productType, productData), [productType, productData]);
  const total = (selectedPlan?.basePrice || 0) + selectedExtras.reduce((s, p) => s + p.price, 0) + surcharge;

  function updateProductField(field, value) { setProductData((c) => ({ ...c, [field]: value })); }
  function updatePersonField(field, value) { setPerson((c) => ({ ...c, [field]: value })); }
  function toggleExtra(code) {
    setExtraCodes((c) => c.includes(code) ? c.filter((x) => x !== code) : [...c, code]);
  }

  async function submit() {
    setLoading(true); setMessage("");
    try {
      const quote = await api("/api/quotes", { method: "POST", body: { productType, planCode, extraCodes, productData, person } });
      setCreatedQuote(quote);
      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) { setMessage(e.message); }
    finally { setLoading(false); }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container text-center">
          <h1>Cotizá tu seguro</h1>
          <p>Completá el formulario y recibí tu presupuesto en menos de 2 minutos.</p>
        </div>
      </section>

      <section className="steps-section">
        <div className="container">
          <div className="steps">
            {STEP_LABELS.map((label, i) => (
              <React.Fragment key={label}>
                {i > 0 && <div className={step > i + 1 ? "step-line done" : "step-line"} />}
                <div className={step === i + 1 ? "step active" : step > i + 1 ? "step done" : "step"}>
                  <div className="step-circle">{step > i + 1 ? "✓" : i + 1}</div>
                  <span>{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="form-section">
        <div className="container form-container">
          {message && <p className="alert">{message}</p>}

          {/* PASO 1: Producto */}
          {step === 1 && (
            <div className="form-step">
              <h2>Elegí el tipo de seguro</h2>
              <div className="product-grid">
                {products.map((p) => (
                  <button
                    key={p}
                    className={productType === p ? "product-option selected" : "product-option"}
                    onClick={() => setProductType(p)}
                  >
                    <strong>{productLabels[p]}</strong>
                    <span>{productDescriptions[p]}</span>
                  </button>
                ))}
              </div>
              <div className="form-actions">
                <span />
                <button className="btn btn-green btn-lg" onClick={() => setStep(2)}>Siguiente →</button>
              </div>
            </div>
          )}

          {/* PASO 2: Datos del producto */}
          {step === 2 && (
            <div className="form-step">
              <h2>Datos para {productLabels[productType]}</h2>
              <div className="form-grid">
                {productFields[productType].map(([field, label, type, options]) => (
                  <div className="form-group" key={field}>
                    <label htmlFor={field}>{label}</label>
                    {type === "select" ? (
                      <select id={field} required value={productData[field] || ""} onChange={(e) => updateProductField(field, e.target.value)}>
                        <option value="">Seleccioná</option>
                        {options.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input id={field} required type={type} value={productData[field] || ""} onChange={(e) => updateProductField(field, e.target.value)} />
                    )}
                  </div>
                ))}
              </div>
              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Anterior</button>
                <button className="btn btn-green btn-lg" onClick={() => setStep(3)}>Siguiente →</button>
              </div>
            </div>
          )}

          {/* PASO 3: Datos personales */}
          {step === 3 && (
            <div className="form-step">
              <h2>Tus datos personales</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">Nombre *</label>
                  <input id="firstName" required value={person.firstName || ""} onChange={(e) => updatePersonField("firstName", e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Apellido *</label>
                  <input id="lastName" required value={person.lastName || ""} onChange={(e) => updatePersonField("lastName", e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input id="email" required type="email" value={person.email || ""} onChange={(e) => updatePersonField("email", e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Teléfono *</label>
                  <input id="phone" required value={person.phone || ""} onChange={(e) => updatePersonField("phone", e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="dni">DNI *</label>
                  <input id="dni" required value={person.dni || ""} onChange={(e) => updatePersonField("dni", e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="birthDate">Fecha de nacimiento *</label>
                  <input id="birthDate" required type="date" value={person.birthDate || ""} onChange={(e) => updatePersonField("birthDate", e.target.value)} />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="address">Domicilio *</label>
                  <input id="address" required value={person.address || ""} placeholder="Calle, número, piso, localidad" onChange={(e) => updatePersonField("address", e.target.value)} />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setStep(2)}>← Anterior</button>
                <button className="btn btn-green btn-lg" onClick={() => setStep(4)}>Siguiente →</button>
              </div>
            </div>
          )}

          {/* PASO 4: Cobertura y extras */}
          {step === 4 && (
            <div className="form-step">
              <h2>Personalizá tu cobertura</h2>

              <h3 style={{ margin: "0 0 1rem" }}>Tipo de cobertura</h3>
              <div className="coverage-cards">
                {plans.map((plan) => (
                  <label className="coverage-card" key={plan.id}>
                    <input
                      type="radio"
                      name="cobertura"
                      value={plan.planCode}
                      checked={planCode === plan.planCode}
                      onChange={() => setPlanCode(plan.planCode)}
                    />
                    <div className="coverage-body">
                      <div className="coverage-icon">🛡️</div>
                      <strong>{plan.planName}</strong>
                      <p>{plan.description}</p>
                      <span className="coverage-price">{money(plan.basePrice)}</span>
                    </div>
                  </label>
                ))}
              </div>

              {extras.length > 0 && (
                <>
                  <h3 style={{ margin: "2rem 0 1rem" }}>Extras disponibles</h3>
                  <p className="subtitle">Seleccioná los extras que querés agregar a tu póliza.</p>
                  <div className="extras-grid">
                    {extras.map((extra) => (
                      <label className="extra-item" key={extra.id}>
                        <input
                          type="checkbox"
                          name="extra"
                          checked={extraCodes.includes(extra.code)}
                          onChange={() => toggleExtra(extra.code)}
                        />
                        <div className="extra-body">
                          <strong>{extra.name}</strong>
                          <p>{extra.description || ""}</p>
                          <span>+{money(extra.price)}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              <div className="price-summary">
                <div className="price-row">
                  <span>Plan seleccionado:</span>
                  <span>{money(selectedPlan?.basePrice || 0)}</span>
                </div>
                {surcharge > 0 && (
                  <div className="price-row">
                    <span>Ajuste:</span>
                    <span>{money(surcharge)}</span>
                  </div>
                )}
                <div className="price-row">
                  <span>Extras:</span>
                  <span>{money(selectedExtras.reduce((s, e) => s + e.price, 0))}</span>
                </div>
                <div className="price-row price-total">
                  <span>Total estimado:</span>
                  <span>{money(total)}</span>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setStep(3)}>← Anterior</button>
                <button className="btn btn-green btn-lg" disabled={loading} onClick={submit}>
                  {loading ? "Enviando..." : "Confirmar →"}
                </button>
              </div>
            </div>
          )}

          {/* PASO 5: Confirmación */}
          {step === 5 && (
            <div className="success-box">
              <div className="success-icon">✅</div>
              <h2>¡Cotización enviada con éxito!</h2>
              <p>
                Gracias por contactarnos. Recibirás un email con el detalle
                de tu cotización en los próximos minutos.
              </p>
              <div className="confirm-details">
                <p>📧 <strong>Te enviamos un email</strong> con el resumen de tu cotización.</p>
                <p>📞 <strong>Un asesor te llamará</strong> en las próximas 24 hs hábiles.</p>
                <p>
                  💬 <strong>WhatsApp:</strong>{" "}
                  <a className="confirm-whatsapp-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                    {WHATSAPP_PHONE_DISPLAY}
                  </a>
                </p>
                <p>
                  💰 <strong>Precio estimado:</strong>{" "}
                  <span className="highlight-price">
                    {money(createdQuote?.estimatedTotal || total)}
                  </span>
                </p>
              </div>
              <Link className="btn btn-green btn-lg" to="/" style={{ marginTop: "2rem" }}>
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function localSurcharge(productType, data) {
  if (["AUTO", "MOTO"].includes(productType))
    return (Number(data.anio || 0) >= 2023 ? 20 : 0) + (Number(data.kilometraje || 0) > 120000 ? 18 : 0) + (data.uso && data.uso !== "Particular" ? 25 : 0);
  if (productType === "SALUD") return Math.max(0, Number(data.grupoFamiliar || 1) - 1) * 40 + (Number(data.edad || 0) > 55 ? 80 : Number(data.edad || 0) > 40 ? 40 : 0);
  if (productType === "HOGAR") return Number(data.metros || 0) > 120 ? 45 : 0;
  if (productType === "BICICLETA") return Number(data.valorEstimado || 0) > 500000 ? 35 : 0;
  if (productType === "AGRO") return Number(data.hectareas || 0) > 200 ? 140 : 0;
  if (productType === "COMERCIO") return Number(data.empleados || 0) > 5 ? 120 : 0;
  if (productType === "RESPONSABILIDAD_CIVIL") return Number(data.sumaAsegurada || 0) > 3000000 ? 90 : 0;
  return 0;
}
