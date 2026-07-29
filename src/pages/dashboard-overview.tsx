import AdminOverviewPage from "@/pages/admin-overview-page";
import UserOverviewPage from "@/pages/user-overview-page";
import { useAuthStore } from "@/stores/auth-store";
import { Role } from "@/types/user";
import { Navigate } from "react-router";

const DashboardOverview = () => {
  const data = useAuthStore();

  if (!data.isAuthenticated) return <Navigate to="/sign-in" />;

  const overviewPageMaps = {
    [Role.ADMIN]: AdminOverviewPage,
    [Role.USER]: UserOverviewPage,
  };

  const OverviewPage = overviewPageMaps[data.user.role];

  return <OverviewPage />;
};

export default DashboardOverview;
