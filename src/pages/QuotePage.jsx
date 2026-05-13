import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debugPerson, debugProductData, productDescriptions, productFields, productLabels } from "../data.js";
import { api, isDebug, money } from "../lib/api.js";

const products = Object.keys(productLabels);

export default function QuotePage() {
  const [params] = useSearchParams();
  const initialProduct = params.get("producto") && productLabels[params.get("producto")] ? params.get("producto") : "AUTO";
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
    api("/api/public/pricing").then(setPricing).catch((error) => setMessage(error.message));
  }, []);

  useEffect(() => {
    setPlanCode("basica");
    setExtraCodes([]);
    setProductData(isDebug ? debugProductData[productType] : {});
  }, [productType]);

  const plans = pricing.plans.filter((item) => item.productType === productType);
  const extras = pricing.extras.filter((item) => item.productType === productType);
  const selectedPlan = plans.find((item) => item.planCode === planCode) || plans[0];
  const selectedExtras = extras.filter((item) => extraCodes.includes(item.code));
  const surcharge = useMemo(() => localSurcharge(productType, productData), [productType, productData]);
  const total = (selectedPlan?.basePrice || 0) + selectedExtras.reduce((sum, item) => sum + item.price, 0) + surcharge;

  function updateProductField(field, value) {
    setProductData((current) => ({ ...current, [field]: value }));
  }

  function updatePersonField(field, value) {
    setPerson((current) => ({ ...current, [field]: value }));
  }

  function toggleExtra(code) {
    setExtraCodes((current) => (current.includes(code) ? current.filter((item) => item !== code) : [...current, code]));
  }

  async function submit() {
    setLoading(true);
    setMessage("");
    try {
      const quote = await api("/api/quotes", {
        method: "POST",
        body: { productType, planCode, extraCodes, productData, person }
      });
      setCreatedQuote(quote);
      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Cotizá tu seguro</h1>
          <p>Completá el formulario y recibí un presupuesto estimado en pocos pasos.</p>
        </div>
      </section>

      <section className="steps-bar">
        <div className="container step-row">
          {["Producto", "Datos", "Persona", "Cobertura", "Confirmación"].map((label, index) => (
            <button key={label} className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""} onClick={() => step > index + 1 && setStep(index + 1)}>
              <span>{index + 1}</span>{label}
            </button>
          ))}
        </div>
      </section>

      <section className="section muted">
        <div className="container quote-layout">
          <div className="form-card">
            {message && <p className="alert">{message}</p>}
            {step === 1 && (
              <>
                <h2>Elegí el producto</h2>
                <div className="product-grid">
                  {products.map((product) => (
                    <button className={productType === product ? "product-option selected" : "product-option"} key={product} onClick={() => setProductType(product)}>
                      <strong>{productLabels[product]}</strong>
                      <span>{productDescriptions[product]}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Datos para {productLabels[productType]}</h2>
                <div className="form-grid">
                  {productFields[productType].map(([field, label, type, options]) => (
                    <label key={field}>
                      {label}
                      {type === "select" ? (
                        <select required value={productData[field] || ""} onChange={(event) => updateProductField(field, event.target.value)}>
                          <option value="">Seleccionar</option>
                          {options.map((option) => <option key={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input required type={type} value={productData[field] || ""} onChange={(event) => updateProductField(field, event.target.value)} />
                      )}
                    </label>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2>Tus datos personales</h2>
                <div className="form-grid">
                  <label>Nombre<input required value={person.firstName || ""} onChange={(e) => updatePersonField("firstName", e.target.value)} /></label>
                  <label>Apellido<input required value={person.lastName || ""} onChange={(e) => updatePersonField("lastName", e.target.value)} /></label>
                  <label>Email<input required type="email" value={person.email || ""} onChange={(e) => updatePersonField("email", e.target.value)} /></label>
                  <label>Teléfono<input required value={person.phone || ""} onChange={(e) => updatePersonField("phone", e.target.value)} /></label>
                  <label>DNI<input required value={person.dni || ""} onChange={(e) => updatePersonField("dni", e.target.value)} /></label>
                  <label>Fecha de nacimiento<input required type="date" value={person.birthDate || ""} onChange={(e) => updatePersonField("birthDate", e.target.value)} /></label>
                  <label className="full">Domicilio<input required value={person.address || ""} onChange={(e) => updatePersonField("address", e.target.value)} /></label>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2>Cobertura y extras</h2>
                <div className="coverage-grid">
                  {plans.map((plan) => (
                    <button className={planCode === plan.planCode ? "coverage selected" : "coverage"} key={plan.id} onClick={() => setPlanCode(plan.planCode)}>
                      <strong>{plan.planName}</strong>
                      <span>{plan.description}</span>
                      <b>{money(plan.basePrice)}</b>
                    </button>
                  ))}
                </div>
                <h3>Extras disponibles</h3>
                <div className="extras-grid">
                  {extras.map((extra) => (
                    <label className="extra-option" key={extra.id}>
                      <input type="checkbox" checked={extraCodes.includes(extra.code)} onChange={() => toggleExtra(extra.code)} />
                      <span><strong>{extra.name}</strong><small>+{money(extra.price)}</small></span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {step === 5 && (
              <div className="success-box">
                <div className="success-icon">✓</div>
                <h2>Cotización enviada con éxito</h2>
                <p>Recibimos tu solicitud #{createdQuote?.code}. Un asesor te contactará dentro de las próximas 24 hs hábiles.</p>
                <strong className="highlight-price">{money(createdQuote?.estimatedTotal || total)}</strong>
              </div>
            )}

            {step < 5 && (
              <div className="form-actions">
                <button className="btn ghost" disabled={step === 1} onClick={() => setStep((value) => value - 1)}>Anterior</button>
                {step < 4 ? (
                  <button className="btn primary" onClick={() => setStep((value) => value + 1)}>Siguiente</button>
                ) : (
                  <button className="btn primary" disabled={loading} onClick={submit}>{loading ? "Enviando..." : "Confirmar cotización"}</button>
                )}
              </div>
            )}
          </div>

          <aside className="summary-card">
            <h3>Resumen estimado</h3>
            <div><span>Producto</span><strong>{productLabels[productType]}</strong></div>
            <div><span>Plan</span><strong>{selectedPlan?.planName || "A definir"}</strong></div>
            <div><span>Extras</span><strong>{money(selectedExtras.reduce((sum, item) => sum + item.price, 0))}</strong></div>
            <div><span>Ajustes</span><strong>{money(surcharge)}</strong></div>
            <div className="total"><span>Total</span><strong>{money(total)}</strong></div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function localSurcharge(productType, data) {
  if (["AUTO", "MOTO"].includes(productType)) {
    return (Number(data.anio || 0) >= 2023 ? 20 : 0) + (Number(data.kilometraje || 0) > 120000 ? 18 : 0) + (data.uso && data.uso !== "Particular" ? 25 : 0);
  }
  if (productType === "SALUD") return Math.max(0, Number(data.grupoFamiliar || 1) - 1) * 40 + (Number(data.edad || 0) > 55 ? 80 : Number(data.edad || 0) > 40 ? 40 : 0);
  if (productType === "HOGAR") return Number(data.metros || 0) > 120 ? 45 : 0;
  if (productType === "BICICLETA") return Number(data.valorEstimado || 0) > 500000 ? 35 : 0;
  if (productType === "COMERCIO") return Number(data.empleados || 0) > 5 ? 120 : 0;
  if (productType === "RESPONSABILIDAD_CIVIL") return Number(data.sumaAsegurada || 0) > 3000000 ? 90 : 0;
  return 0;
}
