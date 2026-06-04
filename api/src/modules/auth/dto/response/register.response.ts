import { Expose } from 'class-transformer';

export class RegisterResponse {
  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;
}
