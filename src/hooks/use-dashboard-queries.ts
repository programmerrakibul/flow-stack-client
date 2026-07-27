import { toast } from "@/components/ui/toast";
import { dashboardService } from "@/services/dashboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "user"],
    queryFn: () => dashboardService.getUserDashboard(),
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: () => dashboardService.getAdminDashboard(),
  });
};

export const useAdminUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["dashboard", "admin", "users", params],
    queryFn: () => dashboardService.getAdminUsers(params),
  });
};

export const useToggleUserActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => dashboardService.toggleUserActive(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "admin", "users"],
      });
      toast.create({
        title: "User updated",
        description: "User status has been toggled.",
        type: "success",
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.create({
        title: "Failed to update user",
        description: error.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => dashboardService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "admin", "users"],
      });
      toast.create({
        title: "User deleted",
        description: "User has been deleted successfully.",
        type: "success",
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.create({
        title: "Failed to delete user",
        description: error.response?.data?.message || "Something went wrong.",
        type: "error",
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
  return useQuery({
    queryKey: ["dashboard", "admin", "tasks", params],
    queryFn: () => dashboardService.getAllTasks(params),
  });
};
