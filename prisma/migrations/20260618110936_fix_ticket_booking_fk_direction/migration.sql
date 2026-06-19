-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_id_fkey";

-- AlterTable
ALTER TABLE "ticket_bookings" ALTER COLUMN "ticket_id" DROP DEFAULT;
DROP SEQUENCE "ticket_bookings_ticket_id_seq";

-- AlterTable
CREATE SEQUENCE tickets_id_seq;
ALTER TABLE "tickets" ALTER COLUMN "id" SET DEFAULT nextval('tickets_id_seq');
ALTER SEQUENCE tickets_id_seq OWNED BY "tickets"."id";

-- AddForeignKey
ALTER TABLE "ticket_bookings" ADD CONSTRAINT "ticket_bookings_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
