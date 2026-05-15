INSERT INTO "PricingPlan" ("productType", "planCode", "planName", "basePrice", "description", "active", "updatedAt")
VALUES
  ('AGRO', 'basica', 'Básica', 320, 'Seguro Agro esencial para empezar protegido.', true, NOW()),
  ('AGRO', 'intermedia', 'Intermedia', 480, 'Seguro Agro con coberturas ampliadas.', true, NOW()),
  ('AGRO', 'completa', 'Completa', 720, 'Seguro Agro con protección integral.', true, NOW())
ON CONFLICT ("productType", "planCode") DO UPDATE SET
  "planName" = EXCLUDED."planName",
  "basePrice" = EXCLUDED."basePrice",
  "description" = EXCLUDED."description",
  "active" = true,
  "updatedAt" = NOW();

INSERT INTO "PricingExtra" ("productType", "code", "name", "price", "active", "updatedAt")
VALUES
  ('AGRO', 'granizo', 'Granizo para cultivos', 90, true, NOW()),
  ('AGRO', 'maquinaria', 'Maquinaria agrícola', 120, true, NOW()),
  ('AGRO', 'incendio_campo', 'Incendio rural', 75, true, NOW())
ON CONFLICT ("productType", "code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "price" = EXCLUDED."price",
  "active" = true,
  "updatedAt" = NOW();
