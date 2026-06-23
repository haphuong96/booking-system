import { IsInt, IsPositive } from 'class-validator';

export class CreateRouteClaimDto {
  @IsInt()
  @IsPositive()
  ticketId!: number;

  @IsInt()
  @IsPositive()
  routeId!: number;

  @IsInt()
  @IsPositive()
  driverId!: number;
}
