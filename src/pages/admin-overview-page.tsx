import EmptyState from "@/components/shared/empty-state";
import ErrorState from "@/components/shared/error-state";
import LoadingSkeleton from "@/components/shared/loading-skeleton";
import StatCard from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_CONFIG } from "@/constants/enums";
import { useAdminDashboard } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/stores/auth-store";
import type { TAdminDashboard } from "@/types/dashboard";
import { Status } from "@/types/task";
import { Activity, ListTodo, UserCheck, Users, UsersIcon } from "lucide-react";
import { Navigate } from "react-router";

const AdminOverviewPage = () => {
  const authData = useAuthStore();
  const { data, isLoading, error, refetch } = useAdminDashboard();

  if (authData.isLoading || isLoading)
    return <LoadingSkeleton variant="stats" />;

  if (!authData.isAuthenticated) return <Navigate to="/sign-in" replace />;

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const dashboard = data || ({} as unknown as TAdminDashboard);
  const tasksByStatus = dashboard.tasksByStatus || {};
  const topActiveCreators = dashboard.topActiveCreators || [];
  const recentActivity = dashboard.recentActivity || [];

  const statMetrics = [
    {
      title: "Total Users",
      value: dashboard.totalUsers ?? 0,
      icon: Users,
    },
    {
      title: "Active Users",
      value: dashboard.activeUsers ?? 0,
      icon: UserCheck,
    },
    {
      title: "Total Tasks",
      value: dashboard.totalTasks ?? 0,
      icon: ListTodo,
    },
    {
      title: "Active Tasks",
      value: tasksByStatus.IN_PROGRESS ?? 0,
      icon: Activity,
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {authData.user?.name}. Here&apos;s the platform overview.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {statMetrics.map(({ title, value, icon: Icon }) => (
          <StatCard key={title} title={title} value={value} icon={Icon} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(tasksByStatus).map(([key, value]) => {
              const config = STATUS_CONFIG[key as Status];
              const Icon = config.icon;

              return (
                <div key={key} className="flex items-center gap-2">
                  <Icon className={`size-4 ${config.color}`} />
                  <span className="text-sm">{config.label}:</span>
                  <Badge variant={config.badgeVariant}>{String(value)}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Task Creators</CardTitle>
        </CardHeader>
        <CardContent>
          {topActiveCreators.length > 0 ? (
            <div className="space-y-3">
              {topActiveCreators.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {item.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{item.taskCount} tasks</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No task creators found"
              description="There are no task creators found."
              icon={UsersIcon}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((task) => {
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
          ) : (
            <EmptyState
              title="No recent activity"
              description="You don't have any recent activity."
              icon={ListTodo}
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminOverviewPage;
