import { Controller, Post, Body } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from '@/common/security/decorator/current_user.decorator';
import { Permissions } from '@/common/security/decorator/permissions.decorator';
import { ShiftService } from '../service/shift.service';
import {
  CreateShiftRequest,
  UpdateShiftRequest,
  UpdateShiftStatusRequest,
  ShiftResponse,
} from '../dto';
import {
  PaginationRequest,
  ApiResponse,
  PaginationResponse,
  IdRequest,
} from '@/common/dto';

@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post('create')
  @Permissions('shift:create')
  async create(
    @Body() dto: CreateShiftRequest,
    @CurrentUser('id') userId: number,
  ) {
    const shift = await this.shiftService.create(dto, userId);
    return ApiResponse.success(
      plainToInstance(ShiftResponse, shift),
      'Shift created successfully',
    );
  }

  @Post('all')
  @Permissions('shift:view')
  async all() {
    const shifts = await this.shiftService.findActiveShifts();
    return ApiResponse.success(
      plainToInstance(ShiftResponse, shifts),
      'Shift list retrieved successfully',
    );
  }

  @Post('list')
  @Permissions('shift:view')
  async list(@Body() pagination: PaginationRequest) {
    const [data, meta] = await this.shiftService.findAllWithPagination(pagination);
    return ApiResponse.success(
      new PaginationResponse(plainToInstance(ShiftResponse, data), meta),
      'Shift list retrieved successfully',
    );
  }

  @Post('detail')
  @Permissions('shift:view')
  async detail(@Body() dto: IdRequest) {
    const shift = await this.shiftService.findOne(dto.id);
    return ApiResponse.success(
      plainToInstance(ShiftResponse, shift),
      'Shift detail retrieved successfully',
    );
  }

  @Post('update')
  @Permissions('shift:update')
  async update(
    @Body() dto: UpdateShiftRequest,
    @CurrentUser('id') userId: number,
  ) {
    const shift = await this.shiftService.update(dto.id, dto, userId);
    return ApiResponse.success(
      plainToInstance(ShiftResponse, shift),
      'Shift updated successfully',
    );
  }

  @Post('status-update')
  @Permissions('shift:update')
  async updateStatus(
    @Body() dto: UpdateShiftStatusRequest,
    @CurrentUser('id') userId: number,
  ) {
    await this.shiftService.toggleStatus(dto.id, dto, userId);
    return ApiResponse.success(null, 'Shift status updated successfully');
  }

  @Post('soft-delete')
  @Permissions('shift:delete')
  async softDelete(
    @Body() dto: IdRequest,
    @CurrentUser('id') userId: number,
  ) {
    await this.shiftService.softDelete(dto.id, userId);
    return ApiResponse.success(null, 'Shift soft deleted successfully');
  }

  @Post('force-delete')
  @Permissions('shift:delete')
  async forceDelete(@Body() dto: IdRequest) {
    await this.shiftService.forceDelete(dto.id);
    return ApiResponse.success(null, 'Shift permanently deleted successfully');
  }
}
