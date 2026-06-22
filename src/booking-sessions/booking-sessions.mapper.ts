import {
  BookingSessionResponse,
  SessionWithDrivers,
} from './booking-sessions.types';

export function formatSession(
  session: SessionWithDrivers,
): BookingSessionResponse {
  const { bookingTargetDrivers, ...rest } = session;
  return {
    ...rest,
    targetDrivers: bookingTargetDrivers.map((b) => b.driver),
  };
}
