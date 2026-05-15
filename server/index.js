import "dotenv/config";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT || 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(process.env.SESSION_SECRET || "local-secret"));

if (!isProduction) {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true
    })
  );
}

function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  };
}

function publicUser(user) {
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role, active: user.active };
}

async function requireAuth(req, res, next) {
  const token = req.signedCookies?.admin_session;
  if (!token) return res.status(401).json({ message: "No autenticado" });

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date() || !session.user.active) {
    return res.status(401).json({ message: "Sesión inválida" });
  }

  req.user = session.user;
  req.session = session;
  next();
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatQuoteCode(id) {
  return String(1000 + id);
}

async function getPricing(productType) {
  const [plans, extras] = await Promise.all([
    prisma.pricingPlan.findMany({ where: { productType, active: true }, orderBy: { basePrice: "asc" } }),
    prisma.pricingExtra.findMany({ where: { productType, active: true }, orderBy: { price: "asc" } })
  ]);
  return { plans, extras };
}

function surchargeForProduct(productType, productData) {
  const data = productData || {};
  if (["AUTO", "MOTO"].includes(productType)) {
    const year = Number(data.anio || 0);
    const km = Number(data.kilometraje || 0);
    const commercial = data.uso && data.uso !== "Particular";
    return (year >= 2023 ? 20 : 0) + (km > 120000 ? 18 : 0) + (commercial ? 25 : 0);
  }
  if (productType === "SALUD") {
    const age = Number(data.edad || 0);
    const family = Number(data.grupoFamiliar || 1);
    return Math.max(0, family - 1) * 40 + (age > 55 ? 80 : age > 40 ? 40 : 0);
  }
  if (productType === "HOGAR") {
    return Number(data.metros || 0) > 120 ? 45 : 0;
  }
  if (productType === "BICICLETA") {
    return Number(data.valorEstimado || 0) > 500000 ? 35 : 0;
  }
  if (productType === "AGRO") {
    return Number(data.hectareas || 0) > 200 ? 140 : 0;
  }
  if (productType === "COMERCIO") {
    return Number(data.empleados || 0) > 5 ? 120 : 0;
  }
  if (productType === "RESPONSABILIDAD_CIVIL") {
    return Number(data.sumaAsegurada || 0) > 3000000 ? 90 : 0;
  }
  return 0;
}

async function calculateQuote(productType, planCode, extraCodes = [], productData = {}) {
  const { plans, extras } = await getPricing(productType);
  const plan = plans.find((item) => item.planCode === planCode) || plans[0];
  if (!plan) throw new Error("No hay planes activos para este producto");

  const selectedExtras = extras.filter((item) => extraCodes.includes(item.code));
  const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const surcharge = surchargeForProduct(productType, productData);
  return {
    plan,
    selectedExtras,
    surcharge,
    total: plan.basePrice + extrasTotal + surcharge
  };
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendTrackedEmail({ to, subject, text, quoteId, contactRequestId }) {
  if (!smtpConfigured()) {
    return prisma.emailLog.create({
      data: { to, subject, status: "SKIPPED", quoteId, contactRequestId }
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text
    });

    return prisma.emailLog.create({ data: { to, subject, status: "SENT", quoteId, contactRequestId } });
  } catch (error) {
    return prisma.emailLog.create({
      data: {
        to,
        subject,
        status: "FAILED",
        error: error.message,
        quoteId,
        contactRequestId
      }
    });
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/public/company", async (_req, res) => {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  res.json(settings);
});

app.get("/api/public/pricing", async (_req, res) => {
  const [plans, extras] = await Promise.all([
    prisma.pricingPlan.findMany({ where: { active: true }, orderBy: [{ productType: "asc" }, { basePrice: "asc" }] }),
    prisma.pricingExtra.findMany({ where: { active: true }, orderBy: [{ productType: "asc" }, { price: "asc" }] })
  ]);
  res.json({ plans, extras });
});

app.post("/api/quotes/calculate", async (req, res) => {
  try {
    const { productType, planCode, extraCodes, productData } = req.body;
    const result = await calculateQuote(productType, planCode, extraCodes, productData);
    res.json({
      plan: result.plan,
      extras: result.selectedExtras,
      surcharge: result.surcharge,
      total: result.total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/quotes", async (req, res) => {
  try {
    const { productType, planCode, extraCodes = [], productData = {}, person } = req.body;
    if (!productType || !person?.email || !person?.firstName || !person?.lastName) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const calculated = await calculateQuote(productType, planCode, extraCodes, productData);
    const quote = await prisma.quote.create({
      data: {
        code: crypto.randomInt(100000, 999999).toString(),
        productType,
        planCode: calculated.plan.planCode,
        planName: calculated.plan.planName,
        estimatedTotal: calculated.total,
        person: {
          create: {
            firstName: person.firstName,
            lastName: person.lastName,
            email: person.email,
            phone: person.phone,
            dni: person.dni,
            birthDate: parseDate(person.birthDate),
            address: person.address
          }
        },
        productData: { create: { data: productData } },
        extras: {
          create: calculated.selectedExtras.map((extra) => ({
            code: extra.code,
            name: extra.name,
            price: extra.price
          }))
        }
      },
      include: { person: true, extras: true, productData: true }
    });

    const code = formatQuoteCode(quote.id);
    const updated = await prisma.quote.update({
      where: { id: quote.id },
      data: { code },
      include: { person: true, extras: true, productData: true }
    });

    const summary = `Cotización #${code} - ${updated.productType} ${updated.planName} - $${updated.estimatedTotal}/mes`;
    await Promise.all([
      sendTrackedEmail({
        to: person.email,
        subject: "Recibimos tu cotización en Seguros Timbúes",
        text: `${person.firstName}, recibimos tu solicitud. ${summary}. Un asesor te contactará dentro de las próximas 24 hs hábiles.`,
        quoteId: updated.id
      }),
      sendTrackedEmail({
        to: process.env.ADMIN_EMAIL || "admin@segurostimbues.com.ar",
        subject: `Nueva cotización #${code}`,
        text: `${summary}. Cliente: ${person.firstName} ${person.lastName}, ${person.email}, ${person.phone}.`,
        quoteId: updated.id
      })
    ]);

    res.status(201).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Nombre, email y mensaje son obligatorios" });
    }

    const contact = await prisma.contactRequest.create({
      data: { name, email, phone: phone || "", subject: subject || "Consulta web", message }
    });

    await sendTrackedEmail({
      to: process.env.ADMIN_EMAIL || "admin@segurostimbues.com.ar",
      subject: `Consulta web: ${contact.subject}`,
      text: `${name} (${email} / ${phone || "sin teléfono"}) escribió: ${message}`,
      contactRequestId: contact.id
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.adminUser.findUnique({ where: { email } });
  const valid = user && user.active && (await bcrypt.compare(password || "", user.passwordHash));
  if (!valid) return res.status(401).json({ message: "Credenciales inválidas" });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await prisma.session.create({ data: { token, userId: user.id, expiresAt } });
  res.cookie("admin_session", token, sessionCookieOptions());
  res.json(publicUser(user));
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json(publicUser(req.user));
});

app.post("/api/auth/logout", requireAuth, async (req, res) => {
  await prisma.session.deleteMany({ where: { id: req.session.id } });
  res.clearCookie("admin_session");
  res.json({ ok: true });
});

app.get("/api/admin/quotes", requireAuth, async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(50, Math.max(5, Number(req.query.pageSize || 8)));
  const search = String(req.query.search || "").trim();
  const where = {
    ...(req.query.status ? { status: req.query.status } : {}),
    ...(req.query.productType ? { productType: req.query.productType } : {}),
    ...(req.query.planCode ? { planCode: req.query.planCode } : {}),
    ...(search
      ? {
          OR: [
            { code: { contains: search, mode: "insensitive" } },
            { person: { firstName: { contains: search, mode: "insensitive" } } },
            { person: { lastName: { contains: search, mode: "insensitive" } } },
            { person: { email: { contains: search, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      include: { person: true, extras: true, productData: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.quote.count({ where })
  ]);

  res.json({ items, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) });
});

app.get("/api/admin/quotes/:id", requireAuth, async (req, res) => {
  const quote = await prisma.quote.findUnique({
    where: { id: Number(req.params.id) },
    include: { person: true, extras: true, productData: true, emailLogs: true }
  });
  if (!quote) return res.status(404).json({ message: "Cotización no encontrada" });
  res.json(quote);
});

app.patch("/api/admin/quotes/:id", requireAuth, async (req, res) => {
  const quote = await prisma.quote.update({
    where: { id: Number(req.params.id) },
    data: { status: req.body.status },
    include: { person: true, extras: true, productData: true }
  });
  res.json(quote);
});

app.delete("/api/admin/quotes/:id", requireAuth, async (req, res) => {
  await prisma.quote.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

app.get("/api/admin/pricing", requireAuth, async (_req, res) => {
  const [plans, extras] = await Promise.all([
    prisma.pricingPlan.findMany({ orderBy: [{ productType: "asc" }, { basePrice: "asc" }] }),
    prisma.pricingExtra.findMany({ orderBy: [{ productType: "asc" }, { price: "asc" }] })
  ]);
  res.json({ plans, extras });
});

app.patch("/api/admin/pricing", requireAuth, async (req, res) => {
  const { plans = [], extras = [] } = req.body;
  await prisma.$transaction([
    ...plans.map((plan) =>
      prisma.pricingPlan.update({
        where: { id: Number(plan.id) },
        data: { basePrice: Number(plan.basePrice), active: Boolean(plan.active) }
      })
    ),
    ...extras.map((extra) =>
      prisma.pricingExtra.update({
        where: { id: Number(extra.id) },
        data: { price: Number(extra.price), active: Boolean(extra.active) }
      })
    )
  ]);
  res.json({ ok: true });
});

app.get("/api/admin/company", requireAuth, async (_req, res) => {
  res.json(await prisma.companySettings.findUnique({ where: { id: 1 } }));
});

app.patch("/api/admin/company", requireAuth, async (req, res) => {
  const company = await prisma.companySettings.update({
    where: { id: 1 },
    data: {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      instagram: req.body.instagram,
      facebook: req.body.facebook
    }
  });
  res.json(company);
});

app.get("/api/admin/users", requireAuth, async (_req, res) => {
  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  res.json(users.map(publicUser));
});

app.post("/api/admin/users", requireAuth, async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password || "Admin123!", 10);
  const user = await prisma.adminUser.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role || "EDITOR",
      active: req.body.active ?? true,
      passwordHash
    }
  });
  res.status(201).json(publicUser(user));
});

app.patch("/api/admin/users/:id", requireAuth, async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    active: req.body.active
  };
  Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
  if (req.body.password) data.passwordHash = await bcrypt.hash(req.body.password, 10);

  const user = await prisma.adminUser.update({
    where: { id: req.params.id },
    data
  });
  res.json(publicUser(user));
});

if (isProduction) {
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Error interno" });
});

app.listen(port, () => {
  console.log(`API lista en http://localhost:${port}`);
});
