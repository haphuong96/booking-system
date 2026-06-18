-- AlterTable
ALTER TABLE "routes" ADD COLUMN     "name" TEXT;

-- Backfill name as <zone>-<per-zone sequence> (e.g. Z1-1, Z1-2, Z2-1 ...)
UPDATE "routes"
SET "name" = ranked.zone || '-' || ranked.rn
FROM (
  SELECT id, zone, ROW_NUMBER() OVER (PARTITION BY zone ORDER BY id) AS rn
  FROM "routes"
) ranked
WHERE "routes".id = ranked.id;
