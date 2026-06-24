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
import { AdminCreateRouteClaimDto } from './dto/admin-create-route-claim.dto';
import { RouteClaimResponse, RouteClaimsService } from './route-claims.service';

@Controller('admin/route-claims')
export class AdminRouteClaimsController {
  constructor(private readonly service: RouteClaimsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  claim(@Body() dto: AdminCreateRouteClaimDto): Promise<RouteClaimResponse> {
    return this.service.adminClaim(dto);
  }

  @Delete(':ticketId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unclaim(@Param('ticketId', ParseIntPipe) ticketId: number): Promise<void> {
    return this.service.adminUnclaim(ticketId);
  }
}
