import { Prisma } from '../prisma/prisma.types';

export type IncludeTicketDetails = {
  ticketBooking: { include: { driver: true } };
  routeClaim: { include: { route: true } };
};

export type TicketResponse = Prisma.TicketGetPayload<{
  include: IncludeTicketDetails;
}>;
