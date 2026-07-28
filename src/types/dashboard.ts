import type { Priority, Status, TTask } from "./task";
import type { TUser } from "./user";

export interface TUserDashboard {
  totalTasks: number;
  tasksByStatus: { status: Status; count: number }[];
  tasksByPriority: { priority: Priority; count: number }[];
  recentActivity: TTask[];
}

export interface TAdminDashboard {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  tasksByStatus: { status: Status; count: number }[];
  topCreators: { user: TUser; taskCount: number }[];
  recentActivity: TTask[];
}

export interface TAdminUser extends TUser {
  _count: { tasks: number };
}

export interface TToggleActivePayload {
  isActive: boolean;
}
