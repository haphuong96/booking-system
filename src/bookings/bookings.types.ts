import { Prisma } from '../prisma/prisma.types';

export type BookingResponse = Prisma.TicketBookingGetPayload<{
  include: { ticket: true; driver: true };
}>;
