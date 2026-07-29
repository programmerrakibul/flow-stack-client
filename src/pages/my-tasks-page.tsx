import AlertDialogConfirm from "@/components/shared/alert-dialog-confirm";
import type { DataTableColumn } from "@/components/shared/data-table";
import DataTable from "@/components/shared/data-table";
import ErrorState from "@/components/shared/error-state";
import TaskActionsDropdown from "@/components/shared/task-actions-dropdown";
import TaskFilters from "@/components/shared/task-filters";
import TaskForm from "@/components/shared/task-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/constants/enums";
import {
  useDeleteTask,
  useTasks,
  useUpdateTask,
  useUpdateTaskStatus,
} from "@/hooks/use-task";
import { useTaskFilterStore } from "@/stores/task-filter-store";
import type { TTask } from "@/types/task";
import { Priority, Status } from "@/types/task";
import { useMemo, useState } from "react";

const MyTasksPage = () => {
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<TTask | null>(null);
  const { search, status, priority, page, limit, setPage } =
    useTaskFilterStore();

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      status: status !== "ALL" ? status : undefined,
      priority: priority !== "ALL" ? priority : undefined,
      sortBy: "createdAt" as const,
      sortOrder: "desc" as const,
    }),
    [page, limit, search, status, priority],
  );

  const { data, isLoading, error, refetch } = useTasks(queryParams);
  const deleteTask = useDeleteTask();
  const updateStatus = useUpdateTaskStatus();
  const updateTask = useUpdateTask();

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    await updateStatus.mutateAsync({ id: taskId, status: newStatus });
  };

  const handleDelete = async () => {
    if (!deleteTaskId) return;
    await deleteTask.mutateAsync(deleteTaskId);
    setDeleteTaskId(null);
  };

  const handleEditSubmit = (data: { title: string; description: string; priority: Priority }) => {
    if (!editingTask) return;
    updateTask.mutate({ id: editingTask.id, payload: data });
    setEditingTask(null);
  };

  const handleEdit = (task: TTask) => {
    setEditingTask(task);
  };

  const columns: DataTableColumn<TTask>[] = [
    {
      header: "Title",
      accessor: "title",
      cell: (_, row) => <span className="font-medium">{row.title}</span>,
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Priority",
      accessor: "priority",
      cell: (value) => {
        const config = PRIORITY_CONFIG[value as Priority];
        const Icon = config.icon;
        return (
          <Badge variant={config.badgeVariant}>
            <Icon className="size-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const config = STATUS_CONFIG[value as Status];
        const Icon = config.icon;
        return (
          <Badge variant={config.badgeVariant}>
            <Icon className="size-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: "Updated",
      accessor: "updatedAt",
      cell: (value) => (
        <span className="text-muted-foreground">
          {new Date(value as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (_, row) => (
        <TaskActionsDropdown
          task={row}
          onEdit={handleEdit}
          onDelete={setDeleteTaskId}
          onStatusChange={handleStatusChange}
        />
      ),
    },
  ];

  const tasks = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold">My Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track your tasks.
        </p>
      </div>

      <TaskFilters />

      {error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={tasks}
          pagination={data?.pagination}
          isLoading={isLoading}
          onPageChange={(p) => setPage(p)}
          renderCard={(task) => {
            const statusConf = STATUS_CONFIG[task.status];
            const priorityConf = PRIORITY_CONFIG[task.priority];
            return (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{task.title}</CardTitle>
                    <TaskActionsDropdown
                      task={task}
                      onEdit={handleEdit}
                      onDelete={setDeleteTaskId}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {task.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge variant={statusConf.badgeVariant}>
                      {statusConf.label}
                    </Badge>
                    <Badge variant={priorityConf.badgeVariant}>
                      {priorityConf.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          }}
          emptyTitle="No tasks found"
          emptyDescription="Create your first task to get started."
        />
      )}

      <Dialog open={!!editingTask} onOpenChange={(open) => { if (!open) setEditingTask(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              defaultValues={{
                title: editingTask.title,
                description: editingTask.description,
                priority: editingTask.priority,
              }}
              onSubmit={handleEditSubmit}
              submitLabel="Update Task"
              isSubmitting={updateTask.isPending}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialogConfirm
        open={!!deleteTaskId}
        onOpenChange={() => setDeleteTaskId(null)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleteTask.isPending}
      />
    </div>
  );
};

export default MyTasksPage;
