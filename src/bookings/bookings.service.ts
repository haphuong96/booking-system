import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../prisma/prisma.types';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaErrorCode } from '../prisma/prisma.constants';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponse } from './bookings.types';

export type { BookingResponse } from './bookings.types';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async book(dto: CreateBookingDto): Promise<BookingResponse> {
    const now = new Date();

    const ticket = await this.prisma.prisma.ticket.findUnique({
      where: { id: dto.ticketId },
    });
    if (!ticket)
      throw new NotFoundException(`Ticket #${dto.ticketId} not found`);

    const session = await this.prisma.prisma.bookingSession.findFirst({
      where: {
        targetDate: ticket.targetDate,
        startBookingTime: { lte: now },
        endBookingTime: { gte: now },
        bookingTargetDrivers: { some: { driverId: dto.driverId } },
      },
    });
    if (!session) {
      throw new ForbiddenException(
        `No active booking session for driver #${dto.driverId} on this ticket's date`,
      );
    }

    //     2. Same driver exceeding maxTicketsPerDriver via concurrent requests — not handled. The flow is:

    // Driver A req 1: count = 0 < max ✓ → proceeds
    // Driver A req 2: count = 0 < max ✓ → proceeds   ← reads same count, race
    // Driver A req 1: INSERT ticket #1 → success
    // Driver A req 2: INSERT ticket #2 → success       ← now at max+1
    // The count check and the insert are two separate DB round-trips with no atomicity between them.

    // Fix: wrap the count check + insert in a $transaction with isolationLevel: 'Serializable'. PostgreSQL will detect the anomaly and abort one of the conflicting transactions with a serialization error — which maps to our already-defined P2034_TRANSACTION_CONFLICT. The aborted request gets a 409.
    if (session.maxTicketsPerDriver !== null) {
      const bookedCount = await this.prisma.prisma.ticketBooking.count({
        where: {
          driverId: dto.driverId,
          ticket: { targetDate: ticket.targetDate },
        },
      });
      if (bookedCount >= session.maxTicketsPerDriver) {
        throw new ConflictException(
          `Driver #${dto.driverId} has reached the maximum of ${session.maxTicketsPerDriver} tickets for this date`,
        );
      }
    }

    try {
      return await this.prisma.prisma.ticketBooking.create({
        data: {
          ticketId: dto.ticketId,
          driverId: dto.driverId,
          bookedAt: now,
        },
        include: { ticket: true, driver: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PrismaErrorCode.P2002_UNIQUE_CONSTRAINT)
          throw new ConflictException(
            `Ticket #${dto.ticketId} has already been booked`,
          );
        if (e.code === PrismaErrorCode.P2003_FOREIGN_KEY_CONSTRAINT)
          throw new NotFoundException(`Driver #${dto.driverId} not found`);
      }
      throw e;
    }
  }

  async unbook(ticketId: number, driverId: number): Promise<void> {
    const now = new Date();

    const booking = await this.prisma.prisma.ticketBooking.findUnique({
      where: { ticketId },
      include: { ticket: true },
    });
    if (!booking)
      throw new NotFoundException(`No booking found for ticket #${ticketId}`);
    if (booking.driverId !== driverId) {
      throw new ForbiddenException(
        `Ticket #${ticketId} was not booked by driver #${driverId}`,
      );
    }

    const session = await this.prisma.prisma.bookingSession.findFirst({
      where: {
        targetDate: booking.ticket.targetDate,
        bookingTargetDrivers: { some: { driverId } },
      },
    });
    if (
      session?.latestCancellationTime &&
      now > session.latestCancellationTime
    ) {
      throw new ConflictException(
        `Cancellation deadline has passed for this booking`,
      );
    }

    await this.prisma.prisma.ticketBooking.delete({ where: { ticketId } });
  }
}
