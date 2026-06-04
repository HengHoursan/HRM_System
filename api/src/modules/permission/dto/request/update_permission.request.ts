import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdatePermissionRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose({ name: 'display_name' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  group?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  sort?: number;
}
