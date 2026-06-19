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
import { BookingSessionsService } from './booking-sessions.service';
import { CreateBookingSessionDto } from './dto/create-booking-session.dto';

@Controller('booking-sessions')
export class BookingSessionsController {
  constructor(private readonly service: BookingSessionsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBookingSessionDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
