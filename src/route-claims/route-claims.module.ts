import { Module } from '@nestjs/common';
import { RouteClaimsController } from './route-claims.controller';
import { RouteClaimsService } from './route-claims.service';

@Module({
  controllers: [RouteClaimsController],
  providers: [RouteClaimsService],
})
export class RouteClaimsModule {}
