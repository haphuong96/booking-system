import { Module } from '@nestjs/common';
import { AdminRouteClaimsController } from './admin-route-claims.controller';
import { RouteClaimsController } from './route-claims.controller';
import { RouteClaimsService } from './route-claims.service';

@Module({
  controllers: [RouteClaimsController, AdminRouteClaimsController],
  providers: [RouteClaimsService],
})
export class RouteClaimsModule {}
