import type { TUser } from "./user";

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type TTask = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: TUser;
};

export type TTaskQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: Status;
  priority?: Priority;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
