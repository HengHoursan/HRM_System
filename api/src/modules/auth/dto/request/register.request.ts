import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';

export class RegisterRequest {
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
}
