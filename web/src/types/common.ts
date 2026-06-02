// Matches backend ApiResponse<T>
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
}

// Matches backend PaginationMeta
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

// Matches backend PaginationRequest
export interface PaginationRequest {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  search?: string;
  filter?: Record<string, string>;
}

// Matches backend PaginationResponse<T>
export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
