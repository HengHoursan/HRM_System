import { Controller, Post, Body } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from '@/common/security/decorator/current_user.decorator';
import { Permissions } from '@/common/security/decorator/permissions.decorator';
import { BranchService } from '../service/branch.service';
import {
  CreateBranchRequest,
  UpdateBranchRequest,
  BranchResponse,
} from '../dto';
import { UpdateBranchStatusRequest } from '../dto/request/update_branch_status.request';
import {
  PaginationRequest,
  ApiResponse,
  PaginationResponse,
  IdRequest,
} from '@/common/dto';

@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('create')
  @Permissions('branch:create')
  async create(
    @Body() dto: CreateBranchRequest,
    @CurrentUser('id') userId: number,
  ) {
    const branch = await this.branchService.create(dto, userId);
    return ApiResponse.success(
      plainToInstance(BranchResponse, branch),
      'Branch created successfully',
    );
  }

  @Post('all')
  @Permissions('branch:view')
  async all() {
    const branches = await this.branchService.getActiveBranches();
    return ApiResponse.success(
      plainToInstance(BranchResponse, branches),
      'Branch list retrieved successfully',
    );
  }

  @Post('list')
  @Permissions('branch:view')
  async list(@Body() pagination: PaginationRequest) {
    const [data, meta] = await this.branchService.findAllWithPagination(pagination);
    return ApiResponse.success(
      new PaginationResponse(plainToInstance(BranchResponse, data), meta),
      'Branch list retrieved successfully',
    );
  }

  @Post('detail')
  @Permissions('branch:view')
  async detail(@Body() dto: IdRequest) {
    const branch = await this.branchService.findOne(dto.id);
    return ApiResponse.success(
      plainToInstance(BranchResponse, branch),
      'Branch detail retrieved successfully',
    );
  }

  @Post('update')
  @Permissions('branch:update')
  async update(
    @Body() dto: UpdateBranchRequest,
    @CurrentUser('id') userId: number,
  ) {
    const branch = await this.branchService.update(dto.id, dto, userId);
    return ApiResponse.success(
      plainToInstance(BranchResponse, branch),
      'Branch updated successfully',
    );
  }

  @Post('status-update')
  @Permissions('branch:update')
  async updateStatus(
    @Body() dto: UpdateBranchStatusRequest,
    @CurrentUser('id') userId: number,
  ) {
    await this.branchService.updateStatus(dto.id, dto.status, userId);
    return ApiResponse.success(null, 'Branch status updated successfully');
  }

  @Post('soft-delete')
  @Permissions('branch:delete')
  async softDelete(@Body() dto: IdRequest, @CurrentUser('id') userId: number) {
    await this.branchService.softDelete(dto.id, userId);
    return ApiResponse.success(null, 'Branch soft deleted successfully');
  }

  @Post('force-delete')
  @Permissions('branch:delete')
  async forceDelete(@Body() dto: IdRequest) {
    await this.branchService.forceDelete(dto.id);
    return ApiResponse.success(null, 'Branch permanently deleted successfully');
  }
}