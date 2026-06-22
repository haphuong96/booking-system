import { IsInt, IsPositive } from 'class-validator';

export class UnbookDto {
  @IsInt()
  @IsPositive()
  driverId!: number;
}
