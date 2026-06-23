import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BookingSessionsModule } from './booking-sessions/booking-sessions.module';
import { TicketsModule } from './tickets/tickets.module';
import { BookingsModule } from './bookings/bookings.module';
import { RouteClaimsModule } from './route-claims/route-claims.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    BookingSessionsModule,
    TicketsModule,
    BookingsModule,
    RouteClaimsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
