import {
  Controller,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ActivityLogService } from './activity_log.service';
import { CreateActivityLogDto } from './dto/create_activity_log.dto';
import { UpdateActivityLogDto } from './dto/update_activity_log.dto';

@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Post('create')
  create(@Body() createActivityLogDto: CreateActivityLogDto) {
    return this.activityLogService.create(createActivityLogDto);
  }

  @Post('all')
  findAll() {
    return this.activityLogService.findAll();
  }

  @Post('detail/:id')
  findOne(@Param('id') id: string) {
    return this.activityLogService.findOne(+id);
  }

  @Post('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateActivityLogDto: UpdateActivityLogDto,
  ) {
    return this.activityLogService.update(+id, updateActivityLogDto);
  }

  @Post('delete/:id')
  remove(@Param('id') id: string) {
    return this.activityLogService.remove(+id);
  }
}
