import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserRequest {
  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose({ name: 'role_id' })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @Expose()
  @IsString()
  @IsOptional()
  photo?: string;
}
