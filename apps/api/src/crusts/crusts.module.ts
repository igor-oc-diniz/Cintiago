import { Module } from '@nestjs/common';
import { CrustsController } from './crusts.controller';
import { CrustsService } from './crusts.service';

@Module({
  controllers: [CrustsController],
  providers: [CrustsService],
})
export class CrustsModule {}
