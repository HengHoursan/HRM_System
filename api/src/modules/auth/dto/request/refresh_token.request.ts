import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequest {
  @Expose({ name: 'refresh_token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
