import ErrorState from "@/components/shared/error-state";
import LoadingSkeleton from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_CONFIG } from "@/constants/enums";
import { useAdminDashboard } from "@/hooks/use-dashboard-queries";
import { useAuthStore } from "@/stores/auth-store";
import type { TAdminDashboard } from "@/types/api-types";
import { Activity, ListTodo, UserCheck, Users } from "lucide-react";
import { Navigate } from "react-router";

const AdminOverviewPage = () => {
  const authData = useAuthStore();
  const { data, isLoading, error, refetch } = useAdminDashboard();

  if (authData.isLoading || isLoading)
    return <LoadingSkeleton variant="stats" />;

  if (!authData.isAuthenticated) return <Navigate to="/sign-in" replace />;

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const dashboard = data?.data as TAdminDashboard;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {authData.user?.name}. Here&apos;s the platform overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.totalUsers ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.activeUsers ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.totalTasks ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.tasksByStatus?.find((s) => s.status === "IN_PROGRESS")
                ?.count ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {dashboard?.tasksByStatus && dashboard.tasksByStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {dashboard.tasksByStatus.map((item) => {
                const config = STATUS_CONFIG[item.status];
                const Icon = config.icon;
                return (
                  <div key={item.status} className="flex items-center gap-2">
                    <Icon className={`size-4 ${config.color}`} />
                    <span className="text-sm">{config.label}:</span>
                    <Badge variant={config.badgeVariant}>{item.count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {dashboard?.topCreators && dashboard.topCreators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Task Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboard.topCreators.map((item) => (
                <div
                  key={item.user.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {item.user.image ? (
                      <img
                        src={item.user.image}
                        alt={item.user.name}
                        className="size-8 rounded-full"
                      />
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {item.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{item.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.user.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{item.taskCount} tasks</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {dashboard?.recentActivity && dashboard.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboard.recentActivity.map((task) => {
                const statusConf = STATUS_CONFIG[task.status];
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={statusConf.badgeVariant}>
                      {statusConf.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminOverviewPage;
