import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../prisma/prisma.types';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaErrorCode } from '../prisma/prisma.constants';
import { CreateRouteClaimDto } from './dto/create-route-claim.dto';
import { RouteClaimResponse } from './route-claims.types';

export type { RouteClaimResponse } from './route-claims.types';

@Injectable()
export class RouteClaimsService {
  constructor(private readonly prisma: PrismaService) {}

  async claim(dto: CreateRouteClaimDto): Promise<RouteClaimResponse> {
    const now = new Date();

    const booking = await this.prisma.prisma.ticketBooking.findUnique({
      where: { ticketId: dto.ticketId },
      include: { ticket: true },
    });
    if (!booking)
      throw new NotFoundException(
        `No booking found for ticket #${dto.ticketId}`,
      );
    if (booking.driverId !== dto.driverId)
      throw new ForbiddenException(
        `Ticket #${dto.ticketId} was not booked by driver #${dto.driverId}`,
      );

    const route = await this.prisma.prisma.route.findUnique({
      where: { id: dto.routeId },
    });
    if (!route) throw new NotFoundException(`Route #${dto.routeId} not found`);
    if (route.zone !== booking.ticket.zone)
      throw new ConflictException(
        `Route #${dto.routeId} is in zone ${route.zone} but ticket #${dto.ticketId} is in zone ${booking.ticket.zone}`,
      );

    try {
      return await this.prisma.prisma.$transaction(
        async (tx) => {
          const existing = await tx.routeClaim.findFirst({
            where: {
              routeId: dto.routeId,
              ticket: { targetDate: booking.ticket.targetDate },
              // no other ticket of the same date should be able to claim this route
            },
          });
          if (existing)
            throw new ConflictException(
              `Route #${dto.routeId} has already been claimed for this date`,
            );

          return tx.routeClaim.create({
            data: {
              ticketId: dto.ticketId,
              routeId: dto.routeId,
              claimedAt: now,
            },
            include: { route: true, ticket: true },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        // Optimistic locking only protects the row you version-check. If your transaction reads from table A and writes to table B based on that read, optimistic locking on table B alone doesn't protect the read from table A being stale.
        // Serializable isolation covers that entire read→write dependency automatically — which is why it's more powerful for complex multi-row, multi-table logic.
      );
    } catch (e) {
      if (e instanceof HttpException) throw e;
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PrismaErrorCode.P2002_UNIQUE_CONSTRAINT)
          throw new ConflictException(
            `Ticket #${dto.ticketId} is already claimed`,
          );
        if (e.code === PrismaErrorCode.P2034_TRANSACTION_CONFLICT)
          throw new ConflictException(
            `Route #${dto.routeId} has already been claimed for this date`,
          );
      }
      throw e;
    }
  }

  async unclaim(ticketId: number, driverId: number): Promise<void> {
    const claim = await this.prisma.prisma.routeClaim.findUnique({
      where: { ticketId },
      include: { ticket: { include: { ticketBooking: true } } },
    });
    if (!claim)
      throw new NotFoundException(`No claim found for ticket #${ticketId}`);

    const booking = claim.ticket.ticketBooking;
    if (!booking || booking.driverId !== driverId)
      throw new ForbiddenException(
        `Ticket #${ticketId} was not booked by driver #${driverId}`,
      );

    await this.prisma.prisma.routeClaim.delete({ where: { ticketId } });
  }
}
