import { BaseService } from "../base/base.service";
import type { ApiResponse } from "@/types";

export interface UploadResponse {
  image_url: string;
}

export class UploadService extends BaseService {
  async uploadImage(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append("image", file);
    return (await this.api.post<ApiResponse<UploadResponse>>("/upload/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })).data;
  }

  async updateImage(file: File, oldImageUrl: string): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append("new_image", file);
    formData.append("old_image_url", oldImageUrl);
    return (await this.api.post<ApiResponse<UploadResponse>>("/upload/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })).data;
  }
}

export const uploadService = new UploadService();
