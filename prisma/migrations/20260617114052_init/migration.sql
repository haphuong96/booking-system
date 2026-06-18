-- CreateTable
CREATE TABLE "drivers" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" SERIAL NOT NULL,
    "zone" TEXT,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_sessions" (
    "id" SERIAL NOT NULL,
    "region_code" TEXT,
    "name" TEXT,
    "target_date" DATE,
    "start_booking_time" TIMESTAMP(3),
    "end_booking_time" TIMESTAMP(3),
    "latest_cancellation_time" TIMESTAMP(3),
    "max_tickets_per_driver" INTEGER,

    CONSTRAINT "booking_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_bookings" (
    "ticket_id" SERIAL NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "booked_at" TIMESTAMP(3),

    CONSTRAINT "ticket_bookings_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" INTEGER NOT NULL,
    "zone" TEXT,
    "target_date" DATE,
    "route_claimed" INTEGER,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_claims" (
    "ticket_id" INTEGER NOT NULL,
    "route_id" INTEGER NOT NULL,
    "claimed_at" TIMESTAMP(3),

    CONSTRAINT "route_claims_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "booking_target_drivers" (
    "booking_session_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,

    CONSTRAINT "booking_target_drivers_pkey" PRIMARY KEY ("booking_session_id","driver_id")
);

-- AddForeignKey
ALTER TABLE "ticket_bookings" ADD CONSTRAINT "ticket_bookings_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_fkey" FOREIGN KEY ("id") REFERENCES "ticket_bookings"("ticket_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_claims" ADD CONSTRAINT "route_claims_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_claims" ADD CONSTRAINT "route_claims_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_target_drivers" ADD CONSTRAINT "booking_target_drivers_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_target_drivers" ADD CONSTRAINT "booking_target_drivers_booking_session_id_fkey" FOREIGN KEY ("booking_session_id") REFERENCES "booking_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
