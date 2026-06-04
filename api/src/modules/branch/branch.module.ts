import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entity/branch.entity';
import { BranchController } from './controller/branch.controller';
import { BranchService } from './service/branch.service';
import { BranchRepository } from './repository/branch.respository';

@Module({
  imports: [TypeOrmModule.forFeature([Branch])],
  controllers: [BranchController],
  providers: [BranchService, BranchRepository],
  exports: [BranchService],
})
export class BranchModule {}
