import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './entity/holiday.entity';
import { HolidayController } from './controller/holiday.controller';
import { HolidayService } from './service/holiday.service';
import { HolidayRepository } from './repository/holiday.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday])],
  controllers: [HolidayController],
  providers: [HolidayService, HolidayRepository],
  exports: [HolidayService],
})
export class HolidayModule {}
