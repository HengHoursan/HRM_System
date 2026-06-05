import { Controller, Post, Body } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from '@/common/security/decorator/current_user.decorator';
import { Permissions } from '@/common/security/decorator/permissions.decorator';
import { HolidayService } from '../service/holiday.service';
import {
  CreateHolidayRequest,
  UpdateHolidayRequest,
  UpdateHolidayStatusRequest,
  HolidayResponse,
} from '@/modules/holiday/dto';
import {
  PaginationRequest,
  ApiResponse,
  PaginationResponse,
  IdRequest,
} from '@/common/dto';

@Controller('holidays')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Post('create')
  @Permissions('holiday:create')
  async create(
    @Body() dto: CreateHolidayRequest,
    @CurrentUser('id') userId: number,
  ) {
    const holiday = await this.holidayService.create(dto, userId);
    return ApiResponse.success(
      plainToInstance(HolidayResponse, holiday),
      'Holiday created successfully',
    );
  }

  @Post('all')
  @Permissions('holiday:view')
  async all() {
    const holidays = await this.holidayService.findActiveHolidays();
    return ApiResponse.success(
      plainToInstance(HolidayResponse, holidays),
      'Holiday list retrieved successfully',
    );
  }

  @Post('upcoming')
  @Permissions('holiday:view')
  async upcoming() {
    const holidays = await this.holidayService.findUpcomingHolidays();
    return ApiResponse.success(
      plainToInstance(HolidayResponse, holidays),
      'Upcoming holidays retrieved successfully',
    );
  }

  @Post('list')
  @Permissions('holiday:view')
  async list(@Body() pagination: PaginationRequest) {
    const [data, meta] = await this.holidayService.findAllWithPagination(pagination);
    return ApiResponse.success(
      new PaginationResponse(plainToInstance(HolidayResponse, data), meta),
      'Holiday list retrieved successfully',
    );
  }

  @Post('detail')
  @Permissions('holiday:view')
  async detail(@Body() dto: IdRequest) {
    const holiday = await this.holidayService.findOne(dto.id);
    return ApiResponse.success(
      plainToInstance(HolidayResponse, holiday),
      'Holiday detail retrieved successfully',
    );
  }

  @Post('update')
  @Permissions('holiday:update')
  async update(
    @Body() dto: UpdateHolidayRequest,
    @CurrentUser('id') userId: number,
  ) {
    const holiday = await this.holidayService.update(dto.id, dto, userId);
    return ApiResponse.success(
      plainToInstance(HolidayResponse, holiday),
      'Holiday updated successfully',
    );
  }

  @Post('status-update')
  @Permissions('holiday:update')
  async updateStatus(
    @Body() dto: UpdateHolidayStatusRequest,
    @CurrentUser('id') userId: number,
  ) {
    await this.holidayService.toggleStatus(dto.id, dto, userId);
    return ApiResponse.success(null, 'Holiday status updated successfully');
  }

  @Post('delete')
  @Permissions('holiday:delete')
  async delete(
    @Body() dto: IdRequest,
    @CurrentUser('id') userId: number,
  ) {
    await this.holidayService.delete(dto.id, userId);
    return ApiResponse.success(null, 'Holiday deleted successfully');
  }
}
