export interface User {
  id: number;
  email: string;
  username: string;
  role: any;
  permissions?: string[];
  must_change_password?: boolean;
  status: boolean;
  photo?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  roleId: number;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  roleId: number;
  status?: boolean;
  photo?: string;
}

export interface UpdateUserRequest {
  id: number;
  username?: string;
  password?: string;
  email?: string;
  roleId?: number;
  status?: boolean;
  photo?: string;
}

export interface UpdateUserStatusRequest {
  id: number;
  status: boolean;
}

export interface UpdateProfileRequest {
  username: string;
  email: string;
  photo?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  userId: number;
  newPassword: string;
}
