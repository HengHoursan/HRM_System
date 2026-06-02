export interface Permission {
  id: number;
  name: string;
  displayName: string;
  group?: string;
  sort?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionRequest {
  name: string;
  displayName: string;
  group?: string;
  sort?: number;
}

export interface UpdatePermissionRequest extends Partial<CreatePermissionRequest> {
  id: number;
}

export interface RolePermission {
  roleId: number;
  permissionId: number;
  permission: Permission;
}
