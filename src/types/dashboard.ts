import type { Priority, Status, TTask } from "./task";
import type { TUser } from "./user";

export type TasksByStatus = {
  [key in Status]: number;
};

export type TasksByPriority = {
  [key in Priority]: number;
};

export interface TUserDashboard {
  totalTasks: number;
  tasksByStatus: { status: Status; count: number };
  tasksByPriority: { priority: Priority; count: number };
  recentActivity: TTask[];
}

export interface TAdminDashboard {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  tasksByStatus: TasksByStatus;
  tasksByPriority: TasksByPriority;
  topActiveCreators: {
    taskCount: number;
    name: TUser["name"];
    email: TUser["email"];
    id: TUser["id"];
  }[];
  recentActivity: TTask[];
}

export interface TAdminUser extends TUser {
  _count: { tasks: number };
}

export interface TToggleActivePayload {
  isActive: boolean;
}
