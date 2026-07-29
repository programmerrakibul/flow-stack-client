import AlertDialogConfirm from "@/components/shared/alert-dialog-confirm";
import type { DataTableColumn } from "@/components/shared/data-table";
import DataTable from "@/components/shared/data-table";
import ErrorState from "@/components/shared/error-state";
import TaskFilters from "@/components/shared/task-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/constants/enums";
import { useDeleteTask, useTasks } from "@/hooks/use-task";
import { useTaskFilterStore } from "@/stores/task-filter-store";
import type { TTask } from "@/types/task";
import { Priority, Status } from "@/types/task";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const AdminAllTasksPage = () => {
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
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

  const handleDelete = async () => {
    if (!deleteTaskId) return;
    await deleteTask.mutateAsync(deleteTaskId);
    setDeleteTaskId(null);
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
      header: "User",
      accessor: "creator",
      cell: (value) => {
        const u = value as TTask["creator"];
        return u?.name ?? "—";
      },
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
      header: "Actions",
      accessor: "id",
      cell: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setDeleteTaskId(row.id)}
              className="text-destructive"
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const tasks = data?.data ?? [];

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold">All Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Manage all tasks across users.
        </p>
      </div>

      <TaskFilters />

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
                  <div className="space-y-1">
                    <CardTitle>{task.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {task.description}
                    </p>
                    {task.creator?.name && (
                      <p className="text-xs text-muted-foreground">
                        by {task.creator.name}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="sm" />}
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setDeleteTaskId(task.id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
        emptyDescription="No tasks match your filters."
      />

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

export default AdminAllTasksPage;
