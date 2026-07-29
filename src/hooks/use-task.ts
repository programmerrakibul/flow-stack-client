import { queryClient } from "@/providers/query-provider";
import { taskService } from "@/services/task";
import { useAuthStore } from "@/stores/auth-store";
import type { Status, TTaskQueryParams } from "@/types/task";
import type {
  TaskFormData,
  TaskUpdateFormData,
} from "@/validation/task.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const taskQueryKeys = {
  all: ["tasks"],
  list: (params: TTaskQueryParams) => ["tasks", params],
  single: (id: string) => ["tasks", id],
};

export const useTasks = (params: TTaskQueryParams) => {
  const data = useAuthStore();
  const email = data.isAuthenticated ? data.user.email : "";

  return useQuery({
    queryKey: [...taskQueryKeys.list(params), { email }],
    queryFn: () => taskService.getAll(params),
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: (payload: TaskFormData) => taskService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
      toast.success("Task created", {
        description: "Your task has been created successfully.",
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error("Failed to create task", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    },
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TaskUpdateFormData>;
    }) => taskService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
      toast.success("Task updated", {
        description: "Task has been updated successfully.",
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error("Failed to update task", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    },
  });
};

export const useUpdateTaskStatus = () => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      taskService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
      toast.success("Status updated", {
        description: "Task status has been updated.",
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error("Failed to update status", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    },
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
      toast.success("Task deleted", {
        description: "Task has been deleted successfully.",
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error("Failed to delete task", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    },
  });
};
