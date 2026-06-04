import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsEmail, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateUserRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsOptional()
  @IsString()
  username?: string;

  @Expose()
  @IsOptional()
  @IsString()
  password?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose({ name: 'role_id' })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @Expose()
  @IsString()
  @IsOptional()
  photo?: string;
}
