import {
  IsArray,
  IsDateString,
  IsInt,
  IsPositive,
  IsString,
  ArrayMinSize,
} from 'class-validator';

export class CreateBookingSessionDto {
  @IsString()
  regionCode!: string;

  @IsString()
  name!: string;

  @IsDateString()
  targetDate!: string;

  @IsDateString()
  startBookingTime!: string;

  @IsDateString()
  endBookingTime!: string;

  @IsDateString()
  latestCancellationTime!: string;

  @IsInt()
  @IsPositive()
  maxTicketsPerDriver!: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  targetDriverIds!: number[];
}
