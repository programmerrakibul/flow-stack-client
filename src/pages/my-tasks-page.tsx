import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "@/components/shared/data-table";
import SearchInput from "@/components/shared/search-input";
import LoadingSkeleton from "@/components/shared/loading-skeleton";
import ErrorState from "@/components/shared/error-state";
import { useTasks, useDeleteTask, useUpdateTaskStatus } from "@/hooks/use-task-queries";
import { useTaskFilterStore } from "@/stores/task-filter-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { Status, Priority } from "@/types/task";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/constants/enums";
import { Trash2, MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const MyTasksPage = () => {
  const isMobile = useIsMobile();
  const {
    search,
    status,
    priority,
    page,
    limit,
    setSearch,
    setStatus,
    setPriority,
    setPage,
  } = useTaskFilterStore();

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
    [page, limit, search, status, priority]
  );

  const { data, isLoading, error, refetch } = useTasks(queryParams);
  const deleteTask = useDeleteTask();
  const updateStatus = useUpdateTaskStatus();

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    await updateStatus.mutateAsync({ id: taskId, status: newStatus });
  };

  const columns: ColumnDef<(typeof data extends { data?: (infer T)[] } ? T : never)[], unknown>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 size-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const config = PRIORITY_CONFIG[row.original.priority];
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const config = STATUS_CONFIG[row.original.status];
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
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(Status).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => handleStatusChange(task.id, s)}
                  disabled={task.status === s || task.status === Status.COMPLETED}
                >
                  Mark as {STATUS_CONFIG[s].label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => deleteTask.mutateAsync(task.id)}
                className="text-destructive"
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const tasks = data?.data ?? [];

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">My Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your tasks.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search tasks..."
          />
          <div className="flex gap-2">
            <Tabs value={status} onValueChange={(v) => setStatus(v as Status | "ALL")}>
              <TabsList>
                <TabsTrigger value="ALL">All</TabsTrigger>
                {Object.values(Status).map((s) => (
                  <TabsTrigger key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton variant="card" />
        ) : tasks.length === 0 ? (
          <LoadingSkeleton variant="card" rows={0} />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const statusConf = STATUS_CONFIG[task.status];
              const priorityConf = PRIORITY_CONFIG[task.priority];
              return (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{task.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Object.values(Status).map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => handleStatusChange(task.id, s)}
                              disabled={task.status === s || task.status === Status.COMPLETED}
                            >
                              Mark as {STATUS_CONFIG[s].label}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuItem
                            onClick={() => deleteTask.mutateAsync(task.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
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
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold">My Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track your tasks.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search tasks..."
            className="w-72"
          />
          <Tabs value={status} onValueChange={(v) => setStatus(v as Status | "ALL")}>
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              {Object.values(Status).map((s) => (
                <TabsTrigger key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Tabs value={priority} onValueChange={(v) => setPriority(v as Priority | "ALL")}>
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              {Object.values(Priority).map((p) => (
                <TabsTrigger key={p} value={p}>
                  {PRIORITY_CONFIG[p].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <DataTable
          columns={columns}
          data={tasks}
          pagination={data?.pagination}
          isLoading={isLoading}
          onPaginationChange={(paginationState) => setPage(paginationState.pageIndex + 1)}
          emptyTitle="No tasks found"
          emptyDescription="Create your first task to get started."
        />
      </div>
    </div>
  );
};

export default MyTasksPage;
