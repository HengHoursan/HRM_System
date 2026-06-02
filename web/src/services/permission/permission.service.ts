import { BaseService } from "@/services/base/base.service";
import type { 
  Permission, 
  CreatePermissionRequest, 
  UpdatePermissionRequest,
  ApiResponse, 
  PaginationResponse 
} from "@/types";

export class PermissionService extends BaseService {
  async getAll(): Promise<ApiResponse<Permission[]>> {
    return this.post<ApiResponse<Permission[]>>("/permissions/all", {});
  }

  async getList(payload: any): Promise<ApiResponse<PaginationResponse<Permission>>> {
    return this.post<ApiResponse<PaginationResponse<Permission>>>("/permissions/list", payload);
  }

  async getDetail(id: number): Promise<ApiResponse<Permission>> {
    return this.post<ApiResponse<Permission>>("/permissions/detail", { id });
  }

  async create(payload: CreatePermissionRequest): Promise<ApiResponse<Permission>> {
    return this.post<ApiResponse<Permission>>("/permissions/create", payload);
  }

  async update(payload: UpdatePermissionRequest): Promise<ApiResponse<Permission>> {
    return this.post<ApiResponse<Permission>>("/permissions/update", payload);
  }

  async softDelete(id: number): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/permissions/soft-delete", { id });
  }

  async forceDelete(id: number): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/permissions/force-delete", { id });
  }
}

export const permissionService = new PermissionService();
