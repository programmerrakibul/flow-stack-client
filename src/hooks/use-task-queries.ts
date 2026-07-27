import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task";
import type { TTaskPayload, TTaskQueryParams } from "@/types/api-types";
import type { Status } from "@/types/task";
import { toast } from "@/components/ui/toast";

export const useTasks = (params: TTaskQueryParams) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => taskService.getAll(params),
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TTaskPayload) => taskService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.create({
        title: "Task created",
        description: "Your task has been created successfully.",
        type: "success",
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.create({
        title: "Failed to create task",
        description: error.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TTaskPayload> }) =>
      taskService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.create({
        title: "Task updated",
        description: "Task has been updated successfully.",
        type: "success",
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.create({
        title: "Failed to update task",
        description: error.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      taskService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.create({
        title: "Status updated",
        description: "Task status has been updated.",
        type: "success",
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.create({
        title: "Failed to update status",
        description: error.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.create({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
        type: "success",
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.create({
        title: "Failed to delete task",
        description: error.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};
