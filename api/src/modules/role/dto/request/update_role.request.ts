import { IsOptional, IsString, IsNumber } from 'class-validator';
import { IdRequest } from '@/common/dto';

export class UpdateRoleRequest extends IdRequest {

  @IsOptional()
  @IsString()
  name?: string;
}
