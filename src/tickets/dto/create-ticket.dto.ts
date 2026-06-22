import { IsDateString, IsIn } from 'class-validator';

const ZONES = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7', 'Z8', 'Z9', 'Z10'];

export class CreateTicketDto {
  @IsIn(ZONES)
  zone!: string;

  @IsDateString()
  targetDate!: string;
}
