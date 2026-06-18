CREATE TABLE "drivers" (
  "id" integer PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "routes" (
  "id" integer PRIMARY KEY,
  "zone" varchar
);

CREATE TABLE "booking_sessions" (
  "id" integer PRIMARY KEY,
  "region_code" varchar,
  "name" varchar,
  "target_date" date,
  "start_booking_time" datetime,
  "end_booking_time" datetime,
  "latest_cancellation_time" datetime,
  "max_tickets_per_driver" integer
);

CREATE TABLE "tickets" (
  "id" integer PRIMARY KEY,
  "zone" varchar,
  "target_date" date,
  "route_claimed" integer
);

CREATE TABLE "ticket_bookings" (
  "ticket_id" integer PRIMARY KEY,
  "driver_id" integer NOT NULL,
  "booked_at" datetime
);

CREATE TABLE "route_claims" (
  "ticket_id" integer PRIMARY KEY,
  "route_id" integer NOT NULL,
  "claimed_at" datetime
);

CREATE TABLE "booking_target_drivers" (
  "booking_session_id" integer NOT NULL,
  "driver_id" integer NOT NULL
);

ALTER TABLE "booking_target_drivers" ADD CONSTRAINT "fk_booking_target_drivers_drivers" FOREIGN KEY ("driver_id") REFERENCES "drivers" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "booking_target_drivers" ADD CONSTRAINT "fk_booking_target_drivers_bookings" FOREIGN KEY ("booking_session_id") REFERENCES "booking_sessions" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tickets" ADD FOREIGN KEY ("id") REFERENCES "ticket_bookings" ("ticket_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ticket_bookings" ADD FOREIGN KEY ("driver_id") REFERENCES "drivers" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "route_claims" ADD FOREIGN KEY ("route_id") REFERENCES "routes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "route_claims" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") DEFERRABLE INITIALLY IMMEDIATE;
