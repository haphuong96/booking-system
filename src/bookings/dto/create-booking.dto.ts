import { IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsPositive()
  ticketId!: number;

  @IsInt()
  @IsPositive()
  driverId!: number;
}
