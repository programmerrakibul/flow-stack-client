import type { Priority, Status, TTask } from "./task";
import type { Role, TUser } from "./user";

export interface TJwtPayload {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
}

export interface TSignInPayload {
  email: string;
  password: string;
}

export interface TSignUpPayload {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export interface TTaskPayload {
  title: string;
  description: string;
  priority: Priority;
}

export interface TTaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: Status;
  priority?: Priority;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

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
