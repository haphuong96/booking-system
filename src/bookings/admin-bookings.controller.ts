import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookingResponse, BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('admin/bookings')
export class AdminBookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  book(@Body() dto: CreateBookingDto): Promise<BookingResponse> {
    return this.service.adminBook(dto);
  }

  @Delete(':ticketId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unbook(@Param('ticketId', ParseIntPipe) ticketId: number): Promise<void> {
    return this.service.adminUnbook(ticketId);
  }
}
