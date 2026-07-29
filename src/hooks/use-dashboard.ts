import { useAuthStore } from "@/stores/auth-store";
import {
  fetchAdminDashboard,
  fetchUserDashboard,
  useDashboardStore,
} from "@/stores/dashboard-store";
import { useEffect } from "react";

export const useUserDashboard = () => {
  const data = useDashboardStore((s) => s.userDashboard);
  const isLoading = useDashboardStore((s) => s.isLoading);
  const error = useDashboardStore((s) => s.error);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) fetchUserDashboard();
  }, [isAuthenticated]);

  return { data, isLoading, error, refetch: fetchUserDashboard };
};

export const useAdminDashboard = () => {
  const data = useDashboardStore((s) => s.adminDashboard);
  const isLoading = useDashboardStore((s) => s.isLoading);
  const error = useDashboardStore((s) => s.error);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) fetchAdminDashboard();
  }, [isAuthenticated]);

  return { data, isLoading, error, refetch: fetchAdminDashboard };
};
