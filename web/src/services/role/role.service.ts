import { BaseService } from "@/services/base/base.service";
import type { 
  Role, 
  CreateRoleRequest, 
  UpdateRoleRequest, 
  UpdateRoleStatusRequest,
  ApiResponse, 
  PaginationRequest, 
  PaginationResponse,
  RolePermission
} from "@/types";

export class RoleService extends BaseService {
  async getAll(): Promise<ApiResponse<Role[]>> {
    return this.post<ApiResponse<Role[]>>("/roles/all", {});
  }

  async getList(pagination: PaginationRequest): Promise<ApiResponse<PaginationResponse<Role>>> {
    return this.post<ApiResponse<PaginationResponse<Role>>>("/roles/list", pagination);
  }

  async getDetail(id: number): Promise<ApiResponse<Role>> {
    return this.post<ApiResponse<Role>>("/roles/detail", { id });
  }

  async create(payload: CreateRoleRequest): Promise<ApiResponse<Role>> {
    return this.post<ApiResponse<Role>>("/roles/create", payload);
  }

  async update(payload: UpdateRoleRequest): Promise<ApiResponse<Role>> {
    return this.post<ApiResponse<Role>>("/roles/update", payload);
  }

  async updateStatus(payload: UpdateRoleStatusRequest): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/roles/status-update", payload);
  }

  async softDelete(id: number): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/roles/soft-delete", { id });
  }

  async forceDelete(id: number): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/roles/force-delete", { id });
  }

  async getRolePermissions(roleId: number): Promise<ApiResponse<RolePermission[]>> {
    return this.post<ApiResponse<RolePermission[]>>("/role-permissions/all", { roleId });
  }

  async assignPermission(roleId: number, permissionId: number): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/role-permissions/assign", { roleId, permissionIds: [permissionId] });
  }

  async revokePermission(roleId: number, permissionId: number): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>("/role-permissions/revoke", { roleId, permissionIds: [permissionId] });
  }
}

export const roleService = new RoleService();
