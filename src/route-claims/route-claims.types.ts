import { Prisma } from '../prisma/prisma.types';

export type RouteClaimResponse = Prisma.RouteClaimGetPayload<{
  include: { route: true; ticket: true };
}>;
