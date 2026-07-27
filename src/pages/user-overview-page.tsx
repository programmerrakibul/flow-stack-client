import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSkeleton from "@/components/shared/loading-skeleton";
import ErrorState from "@/components/shared/error-state";
import { useUserDashboard } from "@/hooks/use-dashboard-queries";
import { useAuth } from "@/hooks/use-auth";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/constants/enums";
import { ListTodo } from "lucide-react";

const UserOverviewPage = () => {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useUserDashboard();

  if (isLoading) return <LoadingSkeleton variant="stats" />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const dashboard = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          Welcome back, {user?.name}!
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
            <div className="text-2xl font-bold">{dashboard?.totalTasks ?? 0}</div>
          </CardContent>
        </Card>

        {dashboard?.tasksByStatus.map((item) => {
          const config = STATUS_CONFIG[item.status];
          const Icon = config.icon;
          return (
            <Card key={item.status}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
                <Icon className={`size-4 ${config.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {dashboard?.tasksByPriority && dashboard.tasksByPriority.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {dashboard.tasksByPriority.map((item) => {
                const config = PRIORITY_CONFIG[item.priority];
                const Icon = config.icon;
                return (
                  <div key={item.priority} className="flex items-center gap-2">
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

export default UserOverviewPage;
