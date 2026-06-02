import { BaseService } from "../base/base.service";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export class AuthService extends BaseService {
  async register(
    payload: RegisterRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    return this.post<ApiResponse<LoginResponse>>(
      "/authentications/register",
      payload,
    );
  }

  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<ApiResponse<LoginResponse>>(
      "/authentications/login",
      payload,
    );
  }

  async logout(refreshToken?: string): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/authentications/logout", {
      refreshToken,
    });
  }

  async refresh(
    refreshToken: string,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    return this.post<ApiResponse<{ accessToken: string }>>(
      "/authentications/refresh",
      { refreshToken },
    );
  }
}
