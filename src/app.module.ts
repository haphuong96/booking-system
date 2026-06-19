import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BookingSessionsModule } from './booking-sessions/booking-sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    BookingSessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
