export interface Role {
  id: number;
  name: string;
  displayName?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  displayName?: string;
  status?: boolean;
}

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: number;
}

export interface UpdateRoleStatusRequest {
  id: number;
  status: boolean;
}
