import Container from "@/components/shared/container";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signOut, useAuthStore } from "@/stores/auth-store";
import { LayoutDashboard, LogOut, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

const Navbar = () => {
  const data = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

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
            <AnimatedThemeToggler className="size-9" />

            {data.isLoading ? (
              <Spinner className="size-6" />
            ) : data.isAuthenticated ? (
              <>
                <Button onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Button>
                <Button variant="secondary" onClick={signOut}>
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() =>
                  navigate(
                    `/sign-in?to=${encodeURIComponent(location.pathname)}`,
                  )
                }
              >
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
