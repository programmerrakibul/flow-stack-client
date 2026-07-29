import api from "@/lib/axios";
import type { TSuccessResponse } from "@/types/api";
import type { TAdminDashboard, TUserDashboard } from "@/types/dashboard";

export const dashboardService = {
  getUserDashboard: async () => {
    const { data } =
      await api.get<TSuccessResponse<TUserDashboard>>("/dashboard/user");

    if (!data.success) throw new Error(data.message);

    return data.data as TUserDashboard;
  },

  getAdminDashboard: async () => {
    const { data } =
      await api.get<TSuccessResponse<TAdminDashboard>>("/dashboard/admin");

    if (!data.success) throw new Error(data.message);

    return data.data as TAdminDashboard;
  },
};
