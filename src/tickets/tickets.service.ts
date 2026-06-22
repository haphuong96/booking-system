import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Ticket } from '../prisma/prisma.types';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { IncludeTicketDetails, TicketResponse } from './tickets.types';

const includeDetails: IncludeTicketDetails = {
  ticketBooking: { include: { driver: true } },
  routeClaim: { include: { route: true } },
};

export type { TicketResponse } from './tickets.types';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TicketResponse[]> {
    return this.prisma.prisma.ticket.findMany({
      include: includeDetails,
      orderBy: { id: 'asc' },
    });
  }

  async create(dto: CreateTicketDto): Promise<Ticket> {
    return this.prisma.prisma.ticket.create({
      data: {
        zone: dto.zone,
        targetDate: new Date(dto.targetDate),
      },
    });
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.prisma.ticket.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025')
          throw new NotFoundException(`Ticket #${id} not found`);
        if (e.code === 'P2003')
          throw new ConflictException(
            `Ticket #${id} cannot be deleted because it has already been booked or claimed`,
          );
      }
      throw e;
    }
  }
}
