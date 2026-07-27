import Container from "@/components/shared/container";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { Role } from "@/types/user";
import { signOut } from "@/utils/auth-actions";
import { LayoutDashboard, LogOut, Zap } from "lucide-react";
import { Link, useLocation } from "react-router";

const Navbar = () => {
  const data = useAuth();
  const location = useLocation();

  const getDashboardPath = (role: Role) => {
    return role === Role.ADMIN ? "/admin/dashboard" : "/dashboard/overview";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-heading text-lg font-bold"
          >
            <Zap className="h-5 w-5 text-primary" />
            Flow Stack
          </Link>

          <div className="flex items-center gap-2">
            <AnimatedThemeToggler className="size-9 inline-flex items-center justify-center rounded-none border border-border bg-transparent hover:bg-accent transition-colors" />

            {data.isLoading ? (
              <Spinner className="size-8" />
            ) : data.isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm">
                  <Link to={getDashboardPath(data.user.role)}>
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm">
                <Link to="/sign-in" state={{ from: location.pathname }}>
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
