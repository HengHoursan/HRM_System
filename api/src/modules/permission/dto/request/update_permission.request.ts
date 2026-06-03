import { IsOptional, IsString, IsNumber } from 'class-validator';
import { IdRequest } from '@/common/dto';

export class UpdatePermissionRequest extends IdRequest {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsNumber()
  sort?: number;
}
