import ErrorState from "@/components/shared/error-state";
import LoadingSkeleton from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/constants/enums";
import { useUserDashboard } from "@/hooks/use-dashboard-queries";
import { useAuthStore } from "@/stores/auth-store";
import type { TUserDashboard } from "@/types/api-types";
import type { Priority, Status } from "@/types/task";
import { ListTodo } from "lucide-react";
import { Navigate } from "react-router";

const UserOverviewPage = () => {
  const authData = useAuthStore();
  const { data = {}, isLoading, error, refetch } = useUserDashboard();

  if (isLoading) return <LoadingSkeleton variant="stats" />;

  if (!authData.isAuthenticated) return <Navigate to="/sign-in" replace />;

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const dashboard = data?.data as TUserDashboard;

  console.log(dashboard);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          Welcome back, {authData.user?.name}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of your tasks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        {Object.entries(dashboard.tasksByStatus).map(([key, value]) => {
          const config = STATUS_CONFIG[key as Status];
          const Icon = config.icon;

          return (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {config.label}
                </CardTitle>
                <Icon className={`size-4 ${config.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{String(value)}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {Object.entries(dashboard.tasksByPriority).map(([key, value]) => {
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

      { dashboard.recentActivity.length > 0 && (
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

export default UserOverviewPage;
