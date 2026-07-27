import api from "@/lib/axios";
import type { TTask, TTaskPayload, TTaskQueryParams } from "@/types/api-types";
import type { TSuccessResponse } from "@/types/api";

export const taskService = {
  create: async (payload: TTaskPayload) => {
    const { data } = await api.post<TSuccessResponse<TTask>>("/tasks", payload);
    return data;
  },

  getAll: async (params: TTaskQueryParams) => {
    const { data } = await api.get<TSuccessResponse<TTask[]>>("/tasks", {
      params,
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<TSuccessResponse<TTask>>(`/tasks/${id}`);
    return data;
  },

  update: async (id: string, payload: Partial<TTaskPayload>) => {
    const { data } = await api.patch<TSuccessResponse<TTask>>(
      `/tasks/${id}`,
      payload
    );
    return data;
  },

  updateStatus: async (id: string, status: TTask["status"]) => {
    const { data } = await api.patch<TSuccessResponse<TTask>>(
      `/tasks/${id}/status`,
      { status }
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<TSuccessResponse>(`/tasks/${id}`);
    return data;
  },
};
