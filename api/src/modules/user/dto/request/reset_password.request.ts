import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class ResetPasswordRequest {
  @Expose({ name: 'user_id' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @Expose({ name: 'new_password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
