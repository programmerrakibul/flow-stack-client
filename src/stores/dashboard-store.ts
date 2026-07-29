import { dashboardService } from "@/services/dashboard";
import type { TAdminDashboard, TUserDashboard } from "@/types/dashboard";
import { create } from "zustand";

type DashboardState = {
  userDashboard: TUserDashboard | null;
  adminDashboard: TAdminDashboard | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  isLoading: false,
  error: null,
  userDashboard: null,
  adminDashboard: null,
};

const createFetch = <T>(
  fetchFn: () => Promise<T>,
  dataKey: "userDashboard" | "adminDashboard",
) => {
  return async () => {
    useDashboardStore.setState({ isLoading: true });
    try {
      const response = await fetchFn();
      useDashboardStore.setState({
        [dataKey]: response,
        isLoading: false,
      });
    } catch (err) {
      useDashboardStore.setState({
        error: err instanceof Error ? err.message : "Something went wrong",
        isLoading: false,
      });
    } finally {
      useDashboardStore.setState({ isLoading: false });
    }
  };
};

export const useDashboardStore = create<DashboardState>(() => initialState);

export const fetchUserDashboard = createFetch(
  dashboardService.getUserDashboard,
  "userDashboard",
);

export const fetchAdminDashboard = createFetch(
  dashboardService.getAdminDashboard,
  "adminDashboard",
);
