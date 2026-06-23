import { IsInt, IsPositive } from 'class-validator';

export class DeleteRouteClaimDto {
  @IsInt()
  @IsPositive()
  driverId!: number;
}
