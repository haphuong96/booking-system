import { Driver, Prisma } from '../prisma/prisma.types';

export type IncludeTargetDrivers = {
  bookingTargetDrivers: { include: { driver: true } };
};

export type SessionWithDrivers = Prisma.BookingSessionGetPayload<{
  include: IncludeTargetDrivers;
}>;

export type BookingSessionResponse = Omit<
  SessionWithDrivers,
  'bookingTargetDrivers'
> & {
  targetDrivers: Driver[];
};
