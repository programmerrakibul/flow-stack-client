import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "@/components/shared/data-table";
import SearchInput from "@/components/shared/search-input";
import ErrorState from "@/components/shared/error-state";
import { useAdminTasks } from "@/hooks/use-dashboard-queries";
import { Status, Priority } from "@/types/task";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/constants/enums";
import { Trash2, ArrowUpDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

const AdminAllTasksPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status | "ALL">("ALL");
  const [priority, setPriority] = useState<Priority | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      status: status !== "ALL" ? status : undefined,
      priority: priority !== "ALL" ? priority : undefined,
    }),
    [page, search, status, priority]
  );

  const { data, isLoading, error, refetch } = useAdminTasks(params);

  const handleDelete = async () => {
    if (!deleteTaskId) return;
    try {
      await api.delete(`/tasks/${deleteTaskId}`);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "admin", "tasks"] });
      toast.create({ title: "Task deleted", type: "success" });
    } catch {
      toast.create({ title: "Failed to delete task", type: "error" });
    }
    setDeleteTaskId(null);
  };

  const columns: ColumnDef<NonNullable<NonNullable<typeof data>["data"]>[number], unknown>[] = [
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
      accessorKey: "creator",
      header: "Creator",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.creator?.name ?? "Unknown"}
        </span>
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
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteTaskId(row.original.id)}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      ),
    },
  ];

  const tasks = data?.data ?? [];

  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold">All Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Manage all tasks across the platform.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tasks..."
          className="w-72"
        />
        <Tabs value={status} onValueChange={(v) => { setStatus(v as Status | "ALL"); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            {Object.values(Status).map((s) => (
              <TabsTrigger key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs value={priority} onValueChange={(v) => { setPriority(v as Priority | "ALL"); setPage(1); }}>
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
        onPaginationChange={(s) => setPage(s.pageIndex + 1)}
      />

      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAllTasksPage;
