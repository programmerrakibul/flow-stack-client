import api from "@/lib/axios";
import type { TSuccessResponse } from "@/types/api";
import type {
  TAdminDashboard,
  TAdminUser,
  TUserDashboard,
} from "@/types/dashboard";
import type { TTask } from "@/types/task";

export const dashboardService = {
  getUserDashboard: async () => {
    const { data } =
      await api.get<TSuccessResponse<TUserDashboard>>("/dashboard/user");
    return data;
  },

  getAdminDashboard: async () => {
    const { data } =
      await api.get<TSuccessResponse<TAdminDashboard>>("/dashboard/admin");
    return data;
  },

  getAdminUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const { data } = await api.get<TSuccessResponse<TAdminUser[]>>(
      "/dashboard/admin/users",
      { params },
    );
    return data;
  },

  toggleUserActive: async (userId: string) => {
    const { data } = await api.patch<TSuccessResponse>(
      `/dashboard/admin/users/${userId}/toggle-active`,
    );
    return data;
  },

  deleteUser: async (userId: string) => {
    const { data } = await api.delete<TSuccessResponse>(
      `/dashboard/admin/users/${userId}`,
    );
    return data;
  },

  getAllTasks: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const { data } = await api.get<TSuccessResponse<TTask[]>>("/tasks", {
      params,
    });
    return data;
  },
};
