import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import type { Role } from "@/types/user";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard/overview";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
