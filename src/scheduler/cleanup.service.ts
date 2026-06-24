import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanUnclaimedTickets(): Promise<void> {
    const now = new Date();

    const endedSessions = await this.prisma.prisma.bookingSession.findMany({
      where: { endBookingTime: { lt: now } },
      select: { targetDate: true },
      distinct: ['targetDate'],
    });

    const targetDates = endedSessions
      .map((s) => s.targetDate)
      .filter((d): d is Date => d !== null);

    if (targetDates.length === 0) return;

    const { count } = await this.prisma.prisma.ticketBooking.deleteMany({
      where: {
        ticket: {
          targetDate: { in: targetDates },
          routeClaim: { is: null },
        },
      },
    });

    if (count > 0) {
      this.logger.log(`Cleaned ${count} unclaimed ticket booking(s)`);
    }
  }
}
