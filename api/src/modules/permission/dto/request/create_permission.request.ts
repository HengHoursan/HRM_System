import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePermissionRequest {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose({ name: 'display_name' })
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @Expose()
  @IsOptional()
  @IsString()
  group?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  sort?: number;
}
