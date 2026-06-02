import type { AxiosInstance, AxiosResponse } from "axios";
import api from "@/api/api";

export abstract class BaseService {
  protected api: AxiosInstance = api;

  protected async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data);
    return response.data;
  }
}
