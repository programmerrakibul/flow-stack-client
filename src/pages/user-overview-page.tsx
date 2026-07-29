import EmptyState from "@/components/shared/empty-state";
import ErrorState from "@/components/shared/error-state";
import LoadingSkeleton from "@/components/shared/loading-skeleton";
import StatCard from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/constants/enums";
import { useUserDashboard } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/stores/auth-store";
import type { TUserDashboard } from "@/types/dashboard";
import type { Priority, Status } from "@/types/task";
import { ListTodo, Plus } from "lucide-react";
import { Navigate, useNavigate } from "react-router";

const UserOverviewPage = () => {
  const authData = useAuthStore();
  const navigate = useNavigate();
  const { isLoading, error, data, refetch } = useUserDashboard();

  if (isLoading) return <LoadingSkeleton variant="stats" />;

  if (!authData.isAuthenticated) return <Navigate to="/sign-in" replace />;

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const dashboard = data || ({} as unknown as TUserDashboard);
  const tasksByStatus = dashboard.tasksByStatus || {};
  const tasksByPriority = dashboard.tasksByPriority || {};
  const recentActivity = dashboard.recentActivity || [];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          Welcome back, {authData.user?.name}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of your tasks.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={dashboard?.totalTasks ?? 0}
          icon={ListTodo}
        />

        {Object.entries(tasksByStatus).map(([key, value]) => {
          const config = STATUS_CONFIG[key as Status];
          const Icon = config.icon;

          return (
            <StatCard
              key={key}
              title={config.label}
              value={value}
              icon={Icon}
            />
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {Object.entries(tasksByPriority).map(([key, value]) => {
              const config = PRIORITY_CONFIG[key as Priority];
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
              action={
                <Button onClick={() => navigate("add-task")}>
                  <Plus className="size-4" />
                  Add Task
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default UserOverviewPage;
