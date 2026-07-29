import { queryClient } from "@/providers/query-provider";
import { userService } from "@/services/user";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskQueryKeys } from "./use-task";

export const userQueryKeys = {
  all: ["users"],
  list: (params?: Record<string, number | string>) => ["users", params],
};

export const useAdminUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const data = useAuthStore();
  const email = data.isAuthenticated ? data.user.email : "";

  return useQuery({
    queryKey: userQueryKeys.list({ ...params, email }),
    queryFn: () => userService.getAdminUsers(params),
  });
};

export const useToggleUserActive = () => {
  return useMutation({
    mutationFn: (userId: string) => userService.toggleUserActive(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
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
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: userQueryKeys.all,
        }),
      ]);

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
