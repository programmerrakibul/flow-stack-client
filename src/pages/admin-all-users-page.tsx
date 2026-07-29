import AlertDialogConfirm from "@/components/shared/alert-dialog-confirm";
import type { DataTableColumn } from "@/components/shared/data-table";
import DataTable from "@/components/shared/data-table";
import ErrorState from "@/components/shared/error-state";
import SearchInput from "@/components/shared/search-input";
import UserActionsDropdown from "@/components/shared/user-actions-dropdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_CONFIG } from "@/constants/enums";
import {
  useAdminUsers,
  useDeleteUser,
  useToggleUserActive,
} from "@/hooks/use-user";
import { useTaskFilterStore } from "@/stores/task-filter-store";
import type { TAdminUser } from "@/types/dashboard";
import { Role } from "@/types/user";
import { useMemo, useState } from "react";

const AdminAllUsersPage = () => {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const { search, page, limit, setSearch, setPage } = useTaskFilterStore();

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      sortBy: "createdAt" as const,
      sortOrder: "desc" as const,
    }),
    [page, limit, search],
  );

  const { data, isLoading, error, refetch } = useAdminUsers(queryParams);
  const deleteUser = useDeleteUser();
  const toggleUserActive = useToggleUserActive();

  const handleToggleActive = async (userId: string) => {
    setTogglingUserId(userId);
    try {
      await toggleUserActive.mutateAsync(userId);
    } finally {
      setTogglingUserId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteUserId) return;
    await deleteUser.mutateAsync(deleteUserId);
    setDeleteUserId(null);
  };

  const columns: DataTableColumn<TAdminUser>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (value) => <span className="font-medium">{String(value)}</span>,
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: "role",
      cell: (value) => {
        const config = ROLE_CONFIG[value as Role];
        return <Badge variant={config.badgeVariant}>{config.label}</Badge>;
      },
    },
    {
      header: "Total Tasks",
      accessor: "_count",
      cell: (value) => {
        const count = (value as TAdminUser["_count"]).tasks;
        return <span> {count} </span>;
      },
    },
    {
      header: "Status",
      accessor: "isActive",
      cell: (value) => {
        const isActive = value as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      header: "Joined",
      accessor: "createdAt",
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
        <UserActionsDropdown
          user={row}
          onDelete={setDeleteUserId}
          onToggleActive={handleToggleActive}
          isToggling={togglingUserId === row.id}
        />
      ),
    },
  ];

  const users = data?.data ?? [];

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold">All Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage all registered users.
        </p>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search users..."
        className="w-full sm:w-72"
      />

      <DataTable
        columns={columns}
        data={users}
        pagination={data?.pagination}
        isLoading={isLoading}
        onPageChange={(p) => setPage(p)}
        renderCard={(user) => {
          const roleConf = ROLE_CONFIG[user.role];
          return (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{user.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user._count.tasks} tasks
                    </p>
                  </div>
                  <UserActionsDropdown
                    user={user}
                    onDelete={setDeleteUserId}
                    onToggleActive={handleToggleActive}
                    isToggling={togglingUserId === user.id}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={roleConf.badgeVariant}>
                    {roleConf.label}
                  </Badge>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        }}
        emptyTitle="No users found"
        emptyDescription="No users match your search."
      />

      <AlertDialogConfirm
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
        title="Delete User"
        description="Are you sure you want to delete this user? All their tasks will also be deleted. This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleteUser.isPending}
      />
    </div>
  );
};

export default AdminAllUsersPage;
