import api from "@/lib/axios";
import type { TSuccessResponse } from "@/types/api";
import type { TAdminUser } from "@/types/dashboard";

export const userService = {
  getAdminUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const { data } = await api.get<TSuccessResponse<TAdminUser[]>>("/users", {
      params,
    });

    if (!data.success) throw new Error(data.message);

    return data;
  },

  toggleUserActive: async (userId: string) => {
    const { data } = await api.patch<TSuccessResponse>(
      `/users/${userId}/status`,
    );

    if (!data.success) throw new Error(data.message);

    return data.data;
  },

  deleteUser: async (userId: string) => {
    const { data } = await api.delete<TSuccessResponse>(`/users/${userId}`);

    if (!data.success) throw new Error(data.message);

    return data.data;
  },
};
