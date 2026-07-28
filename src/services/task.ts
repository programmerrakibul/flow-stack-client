import api from "@/lib/axios";
import type { TSuccessResponse } from "@/types/api";
import type { TTask, TTaskQueryParams } from "@/types/task";
import {
  type TaskFormData,
  type TaskUpdateFormData,
} from "@/validation/task.schema";

export const taskService = {
  create: async (payload: TaskFormData) => {
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

  update: async (id: string, payload: Partial<TaskUpdateFormData>) => {
    const { data } = await api.patch<TSuccessResponse<TTask>>(
      `/tasks/${id}`,
      payload,
    );
    return data;
  },

  updateStatus: async (id: string, status: TTask["status"]) => {
    const { data } = await api.patch<TSuccessResponse<TTask>>(
      `/tasks/${id}/status`,
      { status },
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<TSuccessResponse>(`/tasks/${id}`);
    return data;
  },
};
