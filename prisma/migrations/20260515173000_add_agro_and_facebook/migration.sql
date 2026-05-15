ALTER TYPE "ProductType" ADD VALUE IF NOT EXISTS 'AGRO';

ALTER TABLE "CompanySettings"
ADD COLUMN "facebook" TEXT NOT NULL DEFAULT '';

UPDATE "CompanySettings"
SET "facebook" = 'https://www.facebook.com/profile.php?id=100069758515302'
WHERE "id" = 1 AND "facebook" = '';
