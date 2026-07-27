import { create } from "zustand";
import { Status, Priority } from "@/types/task";

interface TaskFilterState {
  search: string;
  status: Status | "ALL";
  priority: Priority | "ALL";
  page: number;
  limit: number;
  setSearch: (search: string) => void;
  setStatus: (status: Status | "ALL") => void;
  setPriority: (priority: Priority | "ALL") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  status: "ALL" as const,
  priority: "ALL" as const,
  page: 1,
  limit: 10,
};

export const useTaskFilterStore = create<TaskFilterState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setPriority: (priority) => set({ priority, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  reset: () => set(initialState),
}));
