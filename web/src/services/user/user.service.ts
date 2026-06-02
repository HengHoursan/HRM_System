import { BaseService } from "@/services/base/base.service";
import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UpdateUserStatusRequest,
  ApiResponse, 
  PaginationRequest, 
  PaginationResponse 
} from "@/types";

export class UserService extends BaseService {
  async getMe(): Promise<ApiResponse<User>> {
    return this.post<ApiResponse<User>>("/users/me", {});
  }

  async getAll(): Promise<ApiResponse<User[]>> {
    return this.post<ApiResponse<User[]>>("/users/all", {});
  }

  async getList(pagination: PaginationRequest): Promise<ApiResponse<PaginationResponse<User>>> {
    return this.post<ApiResponse<PaginationResponse<User>>>("/users/list", pagination);
  }

  async create(payload: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.post<ApiResponse<User>>("/users/create", payload);
  }

  async update(payload: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.post<ApiResponse<User>>("/users/update", payload);
  }

  async updateStatus(payload: UpdateUserStatusRequest): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/users/status-update", payload);
  }

  async getDetail(id: number): Promise<ApiResponse<User>> {
    return this.post<ApiResponse<User>>("/users/detail", { id });
  }

  async softDelete(id: number): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/users/soft-delete", { id });
  }

  async forceDelete(id: number): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/users/force-delete", { id });
  }

  async bulkSoftDelete(ids: number[]): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/users/bulk-soft-delete", { ids });
  }

  async bulkUpdateStatus(ids: number[], status: boolean): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/users/bulk-status-update", { ids, status });
  }

  async updateProfile(payload: any): Promise<ApiResponse<User>> {
    return this.post<ApiResponse<User>>("/users/update-profile", payload);
  }

  async changePassword(payload: any): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/users/change-password", payload);
  }

  async resetPassword(userId: number, newPassword: string): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/users/reset-password", { userId, newPassword });
  }
}

export const userService = new UserService();
