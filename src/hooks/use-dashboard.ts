import { queryClient } from "@/providers/query-provider";
import { dashboardService } from "@/services/dashboard";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskQueryKeys } from "./use-task";

export const dashboardQueryKeys = {
  all: ["dashboard"],
  user: ["dashboard", "user"],
  admin: ["dashboard", "admin"],
};

export const useUserDashboard = () => {
  const data = useAuthStore();
  const email = data.isAuthenticated ? data.user.email : "";

  return useQuery({
    queryKey: [{ email }, ...dashboardQueryKeys.user],
    queryFn: () => dashboardService.getUserDashboard(),
  });
};

export const useAdminDashboard = () => {
  const data = useAuthStore();
  const email = data.isAuthenticated ? data.user.email : "";

  return useQuery({
    queryKey: [...dashboardQueryKeys.admin, { email }],
    queryFn: () => dashboardService.getAdminDashboard(),
  });
};

export const useAdminUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const data = useAuthStore();
  const email = data.isAuthenticated ? data.user.email : "";

  return useQuery({
    queryKey: [{ email }, ...dashboardQueryKeys.admin, "users", params],
    queryFn: () => dashboardService.getAdminUsers(params),
  });
};

export const useToggleUserActive = () => {
  const data = useAuthStore();
  const email = data.isAuthenticated ? data.user.email : "";

  return useMutation({
    mutationFn: (userId: string) => dashboardService.toggleUserActive(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...dashboardQueryKeys.admin, { email }, "users"],
      });
      toast.success("User updated", {
        description: "User status has been toggled.",
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error("Failed to update user", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (userId: string) => dashboardService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "admin", "users", taskQueryKeys.all],
      });
      toast.success("User deleted", {
        description: "User has been deleted successfully.",
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error("Failed to delete user", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    },
  });
};

export const useAdminTasks = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
}) => {
  const data = useAuthStore();
  const email = data.isAuthenticated ? data.user.email : "";

  return useQuery({
    queryKey: [
      { email },
      ...dashboardQueryKeys.admin,
      taskQueryKeys.all,
      params,
    ],
    queryFn: () => dashboardService.getAllTasks(params),
  });
};
