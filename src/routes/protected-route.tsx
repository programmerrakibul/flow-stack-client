import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/auth-store";
import { Role } from "@/types/user";
import { Navigate, Outlet, useLocation } from "react-router";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const data = useAuthStore();
  const location = useLocation();

  if (data.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!data.isAuthenticated) {
    return (
      <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
    );
  }

  const user = data.user;
  const isAdmin = user.role === Role.ADMIN;

  if (!allowedRoles.includes(user.role)) {
    const redirectPath = isAdmin ? "/admin" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
