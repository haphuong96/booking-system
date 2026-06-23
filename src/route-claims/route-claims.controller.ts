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
import { RouteClaimResponse, RouteClaimsService } from './route-claims.service';
import { CreateRouteClaimDto } from './dto/create-route-claim.dto';
import { DeleteRouteClaimDto } from './dto/delete-route-claim.dto';

@Controller('route-claims')
export class RouteClaimsController {
  constructor(private readonly service: RouteClaimsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  claim(@Body() dto: CreateRouteClaimDto): Promise<RouteClaimResponse> {
    return this.service.claim(dto);
  }

  @Delete(':ticketId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unclaim(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() dto: DeleteRouteClaimDto,
  ): Promise<void> {
    return this.service.unclaim(ticketId, dto.driverId);
  }
}
