import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchInput from "@/components/shared/search-input";
import LoadingSkeleton from "@/components/shared/loading-skeleton";
import ErrorState from "@/components/shared/error-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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
import { useAdminUsers, useToggleUserActive, useDeleteUser } from "@/hooks/use-dashboard-queries";
import { ROLE_CONFIG } from "@/constants/enums";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const AdminAllUsersPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
    }),
    [page, search]
  );

  const { data, isLoading, error, refetch } = useAdminUsers(params);
  const toggleActive = useToggleUserActive();
  const deleteUser = useDeleteUser();

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  const handleDelete = async () => {
    if (!deleteUserId) return;
    await deleteUser.mutateAsync(deleteUserId);
    setDeleteUserId(null);
  };

  const generatePageNumbers = () => {
    if (!pagination) return [];
    const { totalPage, page: currentPage } = pagination;
    const pages: (number | "ellipsis")[] = [];

    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPage - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPage - 2) pages.push("ellipsis");
      pages.push(totalPage);
    }
    return pages;
  };

  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold">All Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform users and their access.
        </p>
      </div>

      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search users by name or email..."
        className="w-72"
      />

      {isLoading ? (
        <LoadingSkeleton variant="card" />
      ) : users.length === 0 ? (
        <ErrorState title="No users found" message="No users match your search." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {users.map((user) => {
              const roleConfig = ROLE_CONFIG[user.role];
              const RoleIcon = roleConfig.icon;
              return (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="size-10 rounded-full"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-sm">{user.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant={roleConfig.badgeVariant}>
                        <RoleIcon className="size-3" />
                        {roleConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{user._count.tasks} tasks</span>
                        <span>&bull;</span>
                        <span>
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive.mutateAsync(user.id)}
                        >
                          {user.isActive ? (
                            <ToggleRight className="size-4 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="size-4 text-muted-foreground" />
                          )}
                          {user.isActive ? "Active" : "Inactive"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteUserId(user.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {pagination && pagination.totalPage > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      !pagination.hasPreviousPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {generatePageNumbers().map((pageNum, i) =>
                  pageNum === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={pageNum === pagination.page}
                        onClick={() => setPage(pageNum)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => p + 1)}
                    className={
                      !pagination.hasNextPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? All their tasks will also be deleted. This action cannot be undone.
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

export default AdminAllUsersPage;
