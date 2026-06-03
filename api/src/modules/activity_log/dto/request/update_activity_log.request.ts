import { PartialType } from '@nestjs/swagger';
import { CreateActivityLogDto } from './create_activity_log.request';

export class UpdateActivityLogDto extends PartialType(CreateActivityLogDto) {}
