import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  BookingSessionResponse,
  BookingSessionsService,
} from './booking-sessions.service';
import { CreateBookingSessionDto } from './dto/create-booking-session.dto';

@Controller('booking-sessions')
export class BookingSessionsController {
  constructor(private readonly service: BookingSessionsService) {}

  @Get()
  findAll(): Promise<BookingSessionResponse[]> {
    return this.service.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateBookingSessionDto,
  ): Promise<BookingSessionResponse> {
    return this.service.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
