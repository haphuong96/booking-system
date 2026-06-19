import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingSessionDto } from './dto/create-booking-session.dto';

const includeTargetDrivers = {
  bookingTargetDrivers: { include: { driver: true } },
} as const;

type SessionWithDrivers = Prisma.BookingSessionGetPayload<{
  include: typeof includeTargetDrivers;
}>;

function formatSession(session: SessionWithDrivers) {
  const { bookingTargetDrivers, ...rest } = session;
  return {
    ...rest,
    targetDrivers: bookingTargetDrivers.map((b) => b.driver),
  };
}

@Injectable()
export class BookingSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const sessions = await this.prisma.prisma.bookingSession.findMany({
      include: includeTargetDrivers,
      orderBy: { id: 'asc' },
    });
    return sessions.map(formatSession);
  }

  async create(dto: CreateBookingSessionDto) {
    const session = await this.prisma.prisma.bookingSession.create({
      data: {
        regionCode: dto.regionCode,
        name: dto.name,
        targetDate: new Date(dto.targetDate),
        startBookingTime: new Date(dto.startBookingTime),
        endBookingTime: new Date(dto.endBookingTime),
        latestCancellationTime: new Date(dto.latestCancellationTime),
        maxTicketsPerDriver: dto.maxTicketsPerDriver,
        bookingTargetDrivers: {
          create: dto.targetDriverIds.map((driverId) => ({ driverId })),
        },
      },
      include: includeTargetDrivers,
    });
    return formatSession(session);
  }

  async delete(id: number) {
    const session = await this.prisma.prisma.bookingSession.findUnique({
      where: { id },
    });
    if (!session)
      throw new NotFoundException(`BookingSession #${id} not found`);

    await this.prisma.prisma.$transaction([
      this.prisma.prisma.bookingTargetDriver.deleteMany({
        where: { bookingSessionId: id },
      }),
      this.prisma.prisma.bookingSession.delete({ where: { id } }),
    ]);
  }
}
