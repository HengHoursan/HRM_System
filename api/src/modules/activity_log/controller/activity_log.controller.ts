import { Controller, Post, Body } from '@nestjs/common';
import { Permissions } from '@/common/security/decorator/permissions.decorator';
import { CurrentUser } from '@/common/security/decorator/current_user.decorator';
import { ApiResponse, IdRequest } from '@/common/dto';
import { ActivityLogService } from '../service/activity_log.service';
import { CreateActivityLogDto } from '../dto/request/create_activity_log.request';
import { UpdateActivityLogDto } from '../dto/request/update_activity_log.request';

@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Post('create')
  @Permissions('activity_log:create')
  async create(
    @Body() dto: CreateActivityLogDto,
    @CurrentUser('id') userId: number,
  ) {
    const result = await this.activityLogService.create(dto);
    return ApiResponse.success(result, 'Activity log created successfully');
  }

  @Post('all')
  @Permissions('activity_log:view')
  async all() {
    const result = await this.activityLogService.findAll();
    return ApiResponse.success(result, 'Activity log list retrieved successfully');
  }

  @Post('detail')
  @Permissions('activity_log:view')
  async detail(@Body() dto: IdRequest) {
    const result = await this.activityLogService.findOne(dto.id);
    return ApiResponse.success(result, 'Activity log detail retrieved successfully');
  }

  @Post('update')
  @Permissions('activity_log:update')
  async update(
    @Body() dto: UpdateActivityLogDto & { id: number },
    @CurrentUser('id') userId: number,
  ) {
    const result = await this.activityLogService.update(dto.id, dto);
    return ApiResponse.success(result, 'Activity log updated successfully');
  }

  @Post('force-delete')
  @Permissions('activity_log:delete')
  async forceDelete(@Body() dto: IdRequest) {
    await this.activityLogService.remove(dto.id);
    return ApiResponse.success(null, 'Activity log deleted successfully');
  }
}
