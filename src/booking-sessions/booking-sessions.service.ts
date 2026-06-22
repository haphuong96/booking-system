import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingSessionDto } from './dto/create-booking-session.dto';
import { formatSession } from './booking-sessions.mapper';
import {
  BookingSessionResponse,
  IncludeTargetDrivers,
} from './booking-sessions.types';

const includeTargetDrivers: IncludeTargetDrivers = {
  bookingTargetDrivers: { include: { driver: true } },
};

export type { BookingSessionResponse } from './booking-sessions.types';

@Injectable()
export class BookingSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<BookingSessionResponse[]> {
    const sessions = await this.prisma.prisma.bookingSession.findMany({
      include: includeTargetDrivers,
      orderBy: { id: 'asc' },
    });
    return sessions.map(formatSession);
  }

  async create(dto: CreateBookingSessionDto): Promise<BookingSessionResponse> {
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

  async delete(id: number): Promise<void> {
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
