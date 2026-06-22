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
import { UnbookDto } from './dto/unbook.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  book(@Body() dto: CreateBookingDto): Promise<BookingResponse> {
    return this.service.book(dto);
  }

  @Delete(':ticketId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unbook(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() dto: UnbookDto,
  ): Promise<void> {
    return this.service.unbook(ticketId, dto.driverId);
  }
}
