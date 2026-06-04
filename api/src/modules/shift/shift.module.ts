import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entity/shift.entity';
import { ShiftController } from './controller/shift.controller';
import { ShiftService } from './service/shift.service';
import { ShiftRepository } from './repository/shift.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Shift])],
  controllers: [ShiftController],
  providers: [ShiftService, ShiftRepository],
  exports: [ShiftService],
})
export class ShiftModule {}
