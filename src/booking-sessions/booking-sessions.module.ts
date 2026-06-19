import { Module } from '@nestjs/common';
import { BookingSessionsController } from './booking-sessions.controller';
import { BookingSessionsService } from './booking-sessions.service';

@Module({
  controllers: [BookingSessionsController],
  providers: [BookingSessionsService],
})
export class BookingSessionsModule {}
