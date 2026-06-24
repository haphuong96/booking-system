import { IsInt, IsPositive } from 'class-validator';

export class AdminCreateRouteClaimDto {
  @IsInt()
  @IsPositive()
  ticketId!: number;

  @IsInt()
  @IsPositive()
  routeId!: number;
}
