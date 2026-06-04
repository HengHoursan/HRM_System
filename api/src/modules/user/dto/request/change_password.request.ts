import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordRequest {
  @Expose({ name: 'current_password' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @Expose({ name: 'new_password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
